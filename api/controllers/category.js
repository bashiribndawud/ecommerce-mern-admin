import Category from "../models/Category.js";

export const newCategory = async (req, res) => {
  const { name, parentCategory, properties } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Provide Category" });
    }
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties
    });
    return res.status(201).json(categoryDoc);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const allCategories = async (req, res) => {
  const categories = await Category.find().populate("parent");

  if (categories) {
    return res.status(200).json(categories);
  }
};

export const editCategory = async (req, res) => {
  const { id } = req.params;
  const { name, parentCategory, properties } = req.body;
  const updateCategory = await Category.findByIdAndUpdate(id, {
    name,
    parent: parentCategory || undefined,
    properties
  }, {new: true});
  return res.status(200).json({message: "Category Update"})
};

export const deleteCategory = async (req, res) => {
    const {_id} = req.query;
    await Category.deleteOne({_id});
    return res.status(200).json({ message: "Category Delete" });
}
