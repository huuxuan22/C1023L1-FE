import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import {deleteProduct} from "../../../service/ProductService";
function ModalDelete({show, setShow, product, currentPage, sortBy, sortOrder, getProducts}) {
    const handleClose = () => setShow(false);

    const handleDelete = () => {
        deleteProduct(product.productId).then(() => {
            handleClose();
            getProducts(currentPage, sortBy, sortOrder);
            toast.success(`Delete ${product.productName} `);
        })
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to delete : {product.productName}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button style={{backgroundColor:"#bd965f", border:"none"}} variant="primary" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ModalDelete;