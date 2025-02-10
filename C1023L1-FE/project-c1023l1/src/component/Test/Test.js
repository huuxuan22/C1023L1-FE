

const Test = () => {
    console.log("đã đi vào phần test");
    
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('user');
    console.log(token);
    console.log(role);
    console.log(user);
    return (
        <div>
            Đây là component test
        </div>
    )
}

export default Test