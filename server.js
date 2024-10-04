import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "HouseRecipes",
    password: "chimen9",
    port: 5432,
  });
  db.connect();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

async function insertInDB(recipe){
    var insertedRecipe = await db.query("INSERT INTO recipes (title, preparationtime, portions, preparation, usefullink, tips, ingredients) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [recipe.title, recipe.preparationTime, recipe.portions, recipe.preparation, recipe.usefulLink, recipe.tips, recipe.ingredients]
    );
}

//GET All recipes
app.get("/recipes", async (req, res) => {
    
    var resultRecipesQuery = await db.query("SELECT * FROM recipes");
    var recipes = resultRecipesQuery.rows;

    res.json(recipes);

})

//POST a new recipe
app.post("/recipes", async(req, res) => {
    let newRecipe = req.body;
    //console.log(newRecipe);
    await insertInDB(newRecipe);
    res.json(newRecipe);
  })

//GET one recipe by ID
app.get("/recipes/:id", async (req, res) => {
  var resultRecipesQuery = await db.query("SELECT * FROM recipes where id = $1",
    [req.params.id]
);
  // console.log("req.params",  req.params.id);
  // console.log("req.params",  resultRecipesQuery.rows);
  res.json(resultRecipesQuery.rows[0]);

}) 

//EDIT recipe
app.patch("/recipes/:id", async (req, res) => {
 await db.query("UPDATE recipes SET title= $1, preparationtime= $2, portions= $3, preparation= $4, usefullink= $5, tips= $6, ingredients= $7 WHERE id = $8",
  [req.body.title, req.body.preparationTime, req.body.portions, req.body.preparation, req.body.usefulLink, req.body.tips, req.body.ingredients, req.params.id]
 );
 res.sendStatus(200);
})

//DELETE recipe
app.delete("/recipes/:id", async (req, res) => {
    await db.query("DELETE FROM recipes where id = $1",
        [req.params.id]
    );
    res.sendStatus(200);
  })  

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });
  