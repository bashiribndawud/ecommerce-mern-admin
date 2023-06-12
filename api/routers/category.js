import express from "express";
import {
  newCategory,
  allCategories,
  editCategory,
  deleteCategory,
} from "../controllers/category.js";
const router = express.Router();

router.post('/new', newCategory)
router.get('/all', allCategories)
router.put('/edit/:id', editCategory)
router.delete('/delete', deleteCategory)



export default router
