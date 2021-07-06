const express = require("express")
const mongoose = require("mongoose")
const ejs = require("ejs")
const e = require("express")

const app = express()

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema)


/////////////Requests Targetting all Articles//////////////


app.route('/articles')

.get((req, res) => {
    Article.find(function (err, foundArticles) {
        if(!err) {
            res.send(foundArticles)
        } else {
            res.send(err)
        }
    })
})

.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function (err) {
        if (!err) {
            res.send("Ok")
        } else {
            res.send(err)
        }
    });
})

.delete((req, res) => {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send('All is deleted')
        } else {
            res.send(err)
        }
    })
})

//////////////////Request Targetting a Specific Article////////////

app.route('/articles/:articleTitle')

.get(function (req, res) {
    Article.findOne({title: req.params.articleTitle}, function (err, foundArticle) {
        if(foundArticle) {
            res.send(foundArticle)
        } else {
            res.send('Not found')
        }
    })
})

.put(function (req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {runValidatiors: true},
        function (err) {
            if(!err){
                res.send("Updated!");
            }
        }
    )
})

.patch(function (req, res) {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function (err) {
            if(!err){
                res.send('Updated by patch')
            }else {
                res.send(err)
            }
        }
    )
})

.delete(function (req, res) {
    Article.deleteOne(
        {title: req.params.articleTitle},
        function (err) {
            if (!err) {
                res.send('One is deleted')
            } else {
                res.send(err)
            }
        }
    )
});





app.listen(3000, ()=> console.log('Server is up on port 3000'))