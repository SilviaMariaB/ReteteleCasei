import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";
var numberOfIngredients = 1;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/recipes`);
    console.log(response);
        res.render("index.ejs", { recipes: response.data});
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

// Route to render the edit page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Recipe", submit: "Add Recipe"});
});

app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/recipes/${req.params.id}`);
    console.log(response.data);
    res.render("modify.ejs", {
      heading: "Edit Recipe",
      submit: "Update Recipe",
      recipe: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recipe" });
  }
});

// Create a new recipe
app.post("/api/recipes", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/recipes`, req.body);
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error creating recipe" });
  }
});

// Partially update a recipe
app.post("/api/recipes/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/recipes/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating recipe" });
  }
});

// Delete a recipe
app.get("/api/recipes/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/recipes/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Error deleting recipe" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
