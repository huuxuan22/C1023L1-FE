import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-toastify";
import {deleteCategory} from "../../../service/CategoriesService";
function ModalDeleteCategory({show, setShow, category, getCategories}) {
    const handleClose = () => setShow(false);

    const handleDelete = () => {
        deleteCategory(category.categoryId).then(() => {
            handleClose();
            getCategories();
            toast.success(`Delete ${category.categoryName} `);
        })
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to delete : {category.categoryName}</Modal.Body>
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

export default ModalDeleteCategory;