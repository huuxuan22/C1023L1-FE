import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Chart, registerables} from 'chart.js';
import './income-management.module.css';
import Swal from 'sweetalert2';

Chart.register(...registerables);

const IncomeManagement = () => {
    const [incomeData, setIncomeData] = useState({
        today: [],
        week: [],
        month: [],
        year: [],
    });
    const [chart, setChart] = useState(null);
    const [totalIncome, setTotalIncome] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState(null); // Trạng thái cho radio button
    const [isChartVisible, setIsChartVisible] = useState(false);
    const headers = {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InZvdGhpdHVvbmd2eV9uZXciLCJzdWIiOiJ2b3RoaXR1b25ndnlfbmV3IiwiZXhwIjoyMDkwMTY0MTU2fQ.kK4jNGtxek8m_uLN0a0FyzAaJXeXb0FpKCCBsBV257Q`
    };

    useEffect(() => {
        const fetchIncomeData = async () => {
            try {
                const todayResponse = await axios.get('http://localhost:8080/api/orders/today-by-hour', {headers});
                const weekResponse = await axios.get('http://localhost:8080/api/orders/this-week-by-day', {headers});
                const monthResponse = await axios.get('http://localhost:8080/api/orders/this-month-by-day', {headers});
                const yearResponse = await axios.get('http://localhost:8080/api/orders/this-year-by-month', {headers});

                setIncomeData({
                    today: todayResponse.data,
                    week: weekResponse.data,
                    month: monthResponse.data,
                    year: yearResponse.data,
                });
            } catch (error) {
                console.error('Error fetching income data:', error);
            }
        };

        fetchIncomeData();
    }, []);

    const displayIncome = (period) => {

        setSelectedPeriod(period); // Cập nhật radio button được chọn
        let labels, data;
        switch (period) {
            case 'today':
                labels = Array.from({length: 24}, (_, i) => `${i}h`);
                data = Array(24).fill(0);
                if (incomeData.today) {
                    incomeData.today.forEach(item => {
                        const hour = item.dayCreate[3]; // Assuming dayCreate[2] is the hour
                        if (hour >= 0 && hour < 24) {
                            data[hour] += (item.totalIncome || 0) ; // Accumulate income
                        }
                    });
                }
                break;
            case 'week':
                labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                data = Array(7).fill(0); // Initialize with 7 days

                if (incomeData.week) {
                    incomeData.week.forEach(item => {
                        const dayIndex = item.dayCreate[2] - 2; // Map to 0-based index (0 for Monday)
                        if (dayIndex >= 0 && dayIndex < 7) {
                            data[dayIndex] += (item.totalIncome || 0) ;// Accumulate income
                        }
                    });
                }
                break;
            case 'month':
                labels = Array.from({length: 30}, (_, i) => `Day ${i + 1}`);
                data = Array(30).fill(0);
                if (incomeData.month) {
                    incomeData.month.forEach(item => {
                        const day = item.dayCreate[2] - 1; // Adjust if dayCreate[3] represents the day in the month
                        if (day >= 0 && day < 30) {
                            data[day] += (item.totalIncome || 0) ; // Accumulate income
                        }
                    });
                }
                break;
            case 'year':
                labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                data = Array(12).fill(0);
                if (incomeData.year) {
                    incomeData.year.forEach(item => {
                        const month = item.dayCreate[2] - 1; // Assuming dayCreate[1] is the month
                        if (month >= 0 && month < 12) {
                            data[month] += (item.totalIncome || 0) ;// Accumulate income
                        }
                    });
                }
                break;
            default:
                return;
        }

        const calculatedTotalIncome = data.reduce((a, b) => a + b, 0);
        setTotalIncome(calculatedTotalIncome);
        setIsChartVisible(true);
        // If the chart already exists, destroy it
        if (chart) chart.destroy();

        // Create a new chart
        const newChart = new Chart(document.getElementById('chart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Income',
                    data: data,
                    backgroundColor: 'rgb(212,163,115)',
                    borderColor: 'rgb(212,163,115)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        ticks: {
                            autoSkip: false // Ensure no labels are skipped
                        }
                    }
                }
            }
        });
        document.getElementById('fromDate').value = '';
        document.getElementById('toDate').value = '';
        setChart(newChart);
    };

    const calculateIncome = async () => {
        const fromDateValue = document.getElementById('fromDate').value;
        const toDateValue = document.getElementById('toDate').value;

        const fromDate = new Date(fromDateValue);
        const toDate = new Date(toDateValue);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Please select a valid time period!',
            });
            return;
        }

        if (fromDate > toDate) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Start date must be less than or equal to end date!',
            });
            return;
        }

        const from = `${fromDate.toISOString().split('T')[0]} 00:00:00`;
        const to = `${toDate.toISOString().split('T')[0]} 23:59:59`;

        const timeDifference = Math.floor((toDate - fromDate) / (1000 * 3600 * 24)); // Tính số ngày

        try {
            const response = await axios.get(`http://localhost:8080/api/orders/range?fromDate=${encodeURIComponent(from)}&toDate=${encodeURIComponent(to)}`, {headers});
            const data = response.data;

            if (!Array.isArray(data) || data.length === 0) {
                console.error('Dữ liệu không hợp lệ:', data);
                return;
            }

            let labels, incomeData;
            if (timeDifference === 0) {
                // Thống kê theo giờ nếu từ ngày = đến ngày
                labels = Array.from({length: 24}, (_, i) => `${i}h`);
                incomeData = Array(24).fill(0);
                // data = Array(24).fill(0);
                // if (incomeData.today) {
                //     incomeData.today.forEach(item => {
                //         const hour = item.dayCreate[3]; // Assuming dayCreate[2] is the hour
                //         if (hour >= 0 && hour < 24) {
                //             data[hour] += (item.totalIncome || 0) * 1000; // Accumulate income
                //         }
                //     });
                data.forEach(item => {
                    const hour = item.dayCreate[3];
                    if (hour >= 0 && hour < 24) {
                        incomeData[hour] += (item.totalIncome || 0) ; // Lưu thu nhập theo giờ
                    }
                });
            } else if (timeDifference >= 1 && timeDifference <= 31) {
                // Thống kê theo ngày nếu khoảng cách là từ 1 đến 31 ngày
                labels = Array.from({length: timeDifference + 1}, (_, i) => `Day ${i + 1}`);
                incomeData = Array(timeDifference + 1).fill(0);

                data.forEach(item => {
                    const day = item.dayCreate[2] - 1;
                    if (day >= 0 && day < labels.length) {
                        incomeData[day] += (item.totalIncome || 0) ; // Lưu thu nhập theo ngày
                    }
                });
            } else if (timeDifference >= 32 && timeDifference <= 366) {
                // Thống kê theo tháng nếu khoảng cách là từ 32 đến 366 ngày
                labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                incomeData = Array(12).fill(0);
                // data = Array(12).fill(0);
                // if (incomeData.year) {
                //     incomeData.year.forEach(item => {
                //         const month = item.dayCreate[2]-1; // Assuming dayCreate[1] is the month
                //         if (month >= 0 && month < 12) {
                //             data[month] += (item.totalIncome || 0) * 1000;// Accumulate income
                //         }
                data.forEach(item => {
                    const month = item.dayCreate[1] - 1;
                    if (month >= 0 && month < 12) {
                        incomeData[month] += (item.totalIncome || 0) ; // Lưu thu nhập theo tháng
                    }
                    console.log('Labels:', labels);
                    console.log('Income Data:', incomeData);
                    console.log('Date Create:', month);
                });
            } else {
                // Giả sử fromDate và toDate là các đối tượng Date hợp lệ
                const fromYear = fromDate.getFullYear();
                const toYear = toDate.getFullYear();

            // Tạo mảng labels chứa tất cả các năm từ fromYear đến toYear
                labels = Array.from({length: toYear - fromYear + 1}, (_, i) => fromYear + i);

            // Khởi tạo mảng incomeData với độ dài bằng số năm trong labels, và giá trị ban đầu là 0
                incomeData = Array(labels.length).fill(0);

            // Lặp qua dữ liệu và cộng dồn totalIncome cho từng năm
                data.forEach(item => {
                    const year = item.dayCreate[0];
                    const yearIndex = labels.indexOf(year);

                    if (yearIndex >= 0) {
                        incomeData[yearIndex] += (item.totalIncome || 0) ; // Cộng dồn thu nhập cho mỗi năm
                    }
                });
            }

            // Tính tổng thu nhập
            const calculatedTotalIncome = incomeData.reduce((a, b) => a + b, 0);
            setTotalIncome(calculatedTotalIncome);

            // Nếu biểu đồ đã tồn tại, phá hủy nó trước khi tạo lại
            if (chart) chart.destroy();

            // Tạo biểu đồ mới
            const newChart = new Chart(document.getElementById('chart'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: 'rgb(212,163,115)',
                        borderColor: 'rgb(212,163,115)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                        x: {
                            ticks: {
                                autoSkip: false // Đảm bảo không bỏ qua label nào
                            }
                        }
                    }
                }
            });

            setChart(newChart);
            setIsChartVisible(true);
        } catch (error) {
            console.error('Error calculating income:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while calculating income.',
            });
        }

        // Đặt lại radio button khi click vào tính thu nhập
        setSelectedPeriod(null);
    };


    return (
        <div className="container my-5">
            <div className="header-container">
                <h2>Income Management</h2>
            </div>
            <form>
                <div className="outer-container">
                    <div className="mb-3 row">
                        <label htmlFor="totalIncome" className="col-sm-2 col-form-label">Total income:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control-plaintext" id="totalIncome" disabled
                                   value={`${totalIncome.toLocaleString()} VND`}/>
                        </div>
                    </div>
                    <div className="mb-4 row">
                        <div className="col-sm-5">
                            <label className="form-label">From date:</label>
                            <input type="date" id="fromDate" className="form-control" style={{height: '27px'}}/>
                        </div>
                        <div className="col-sm-5">
                            <label className="form-label">By date:</label>
                            <input type="date" id="toDate" className="form-control" style={{height: '27px'}}/>
                        </div>
                        <div className="col-sm-2 d-flex align-items-end">
                            <button type="button" className="btn btn-orange w-100" onClick={calculateIncome}><i
                                className="fas fa-chart-line" style={{color: 'white'}}></i>Calculate income
                            </button>
                        </div>
                    </div>
                    <div id="incomeDisplay">
                        <div className="mb-3 ">
                            <div>
                                <label className="radio-label">
                                    <input type="radio" name="period" value="today" checked={selectedPeriod === 'today'}
                                           onClick={() => displayIncome('today')}/>
                                    Today
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="period" value="week" checked={selectedPeriod === 'week'}
                                           onClick={() => displayIncome('week')}/>
                                    This week
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="period" value="month" checked={selectedPeriod === 'month'}
                                           onClick={() => displayIncome('month')}/>
                                    This month
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="period" value="year" checked={selectedPeriod === 'year'}
                                           onClick={() => displayIncome('year')}/>
                                    This year
                                </label>
                            </div>
                        </div>

                    </div>
                    {isChartVisible && ( // Chỉ hiển thị biểu đồ khi isChartVisible là true
                        <div style={{height: '400px', marginTop: '20px'}}>
                            <canvas id="chart"></canvas>
                        </div>
                    )}
                </div>

            </form>

        </div>

    );
};

export default IncomeManagement;
