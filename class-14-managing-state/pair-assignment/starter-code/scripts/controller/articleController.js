(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    debugger;
    articleView.index(ctx.articles);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This method first defines a helper function saved as articleData
  //articleData uses the ctx object to manage state and then calls the next cb for the path
  //Then Article.findWhere is called, which makes a SQL query using the id param from the url and calls articleData as an argument
  //articlesController.loadById is called in a page function in routes.js when the path is '/article/:id'
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //First  this method defines a helper function saved as authorData.
  //authorData uses the context object to manage state and calls the next cb
  //Then this method calls Article.findWhere, which makes a SQL query with the authorName param from the url and calls authorData as another argument.
  //Execution path: called in a page function in routes.js when the path is '/article/:id'
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This method first defines a helper function and saves it as categoryData
  //categoryData uses the context object to manage state and then calls the next cb
  //Then it calls Article.findWhere, which makes a SQL query using the categoryName param from the url and calls categoryData as an argument.
  //This method is called in a page function in routes.js when the path is 'article/:categoryName'
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //This method uses an anon. function to set ctx.articles to the Article.all array of all of our data objects
  //then the anon function will call the next cb function. The next cb here is articlesController.index
  //Next an if block is used to set ctx.articles to Article.all IF Article.all is not empty. The it will fire the next cb
  //ELSE, it will fire the Article.fetchAll method, with is defined in the Article module, and handles our data grabbing either by downloading and processing JSON or accessing webDB.

  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
