const express=require("express");
const bodyparser=require("body-parser");

const mongoose=require("mongoose");
const _=require("lodash");
const app=express();
var items=[]
let workitems=[]
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))
mongoose.connect("mongodb+srv://poshalavarsha046:varsha@cluster0.hxza3wm.mongodb.net/todolistdb");
const itemsSchema=new mongoose.Schema(
    {
       name:String
    }
)
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({name:"welocme to your todolist!"});
const item2=new Item({name:"Hit the + item to add an item."});
const item3=new Item({name:"<--- Hit this to delete an item"});
const defaultItems=[item1,item2,item3];
//Item.insertMany(defaultItems).then(()=>{console.log("inserted sucessfully")}).
//catch((err)=>{if(err) console.log(err)})

const listSchema={
    name:String,
    items:[itemsSchema]
}
const List=mongoose.model("List",listSchema)
app.get("/",function(req,res)
{
 
  Item.find().then((data)=>{
    if(data.length===0){
        Item.insertMany(defaultItems).then(()=>{console.log("inserted sucessfully")}).
catch((err)=>{if(err) console.log(err)});
res.redirect("/");
    }
    else{
    res.render("list",{
        listtitle:"Today",
        newlistitems  : data
    });
}
})
    
});

app.post("/",function(req,res)
{
    const itemName=req.body.name1;
    const listName=req.body.list;
   
    const item=new Item({
        name:itemName
    });
    if(listName==='Today'){
        item.save();
        res.redirect("/");
    }
    else
    {
        List.findOne({name:listName}).then((data)=>{
            data.items.push(item);
            data.save();
            res.redirect("/"+listName);
        })
    }
   
});
app.post("/delete",function(req,res){
   const checkedItemId=req.body.checkbox;
   const listName=req.body.listName;
   if(listName==="Today")
   {
    Item.findByIdAndRemove(checkedItemId)
    .then(()=>{console.log("sucessfully deleted checked item")}).
 catch((err)=>{if(err) console.log(err)});
 res.redirect("/"); 
   }
else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{ _id:checkedItemId}}})
    .then(()=>{res.redirect("/"+listName)})

}
   
})
app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName}).then((data)=>{
        if(!data){
            const list=new List({
                name:customListName,
                items:defaultItems
            })
            list.save();
            res.redirect("/"+customListName);
        }
        else
        {
            res.render("list",{
                listtitle:data.name,
                newlistitems  : data.items
            });
        }
    })
   
    
    

})
app.get("/work",function(req,res){
   res.render("list",{listtitle:"work List",newlistitems:workitems}) 
}) 
app.get("/about",function(req,res){
    res.render("about") 
 }) 
app.listen("3000",function()
{
    console.log("app is running");
})
