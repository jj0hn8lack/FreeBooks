const apiDomain = "https://ufostore.herokuapp.com/";
const booksBaseCategoryId = 121;

/* global START */

var generateProductPreviewCard = function (item) {
    let raw = '<div class="col-md-4"><div class="product-item">';
    raw += '<a href="product-details.html"><img loading="lazy" src="' + item["imgUrl"] + '" class="img-fluid product-min-img" alt="' + item["name"] + '"></a>';
    raw += '<div class="down-content">';

    raw += '<a href="product-details.html"><h4>' + item["name"] + '</h4></a>';

    if (item["isAvailable"]) {
        raw += '<h6>' + item["price"] + '₽';
        if (item["charge"] !== "0") {
            raw += '<small class="cashback-lbl badge badge-pill badge-success"> Вернём: ' + item["charge"] + '₽</small>';
        }
        raw += '</h6>';
    }
    else {
        raw += '<h6>Нет в наличии :(</h6>';
    }

    if (item["description"]) {
        raw += '<p>' + item["description"].substr(0, 100).replace('<', '"').replace('>', '"') + ' ...</p>';
    }
    else {
        raw += '<p>К сожалению партнёр не предоставил нам описания продукта. Попробуйте посмотреть на сайте партнёра (кнопка "купить").</p>';
    }

    raw += '<a href="' + item["referalLink"] + '" class="btn btn-primary btn-block">Купить на ' + item["partnerName"] + '</a>';

    raw += '</div></div></div>';
    return raw;
}

/* global END */

/*index.html START*/

var fillLatestProducts = function () {
    let searchRequset = apiDomain + "main/GetWithSubTid?c=6&tid=" + booksBaseCategoryId;
    $.getJSON(searchRequset, generateLatestProducts);
}

var generateLatestProducts = function (data) {
    let products = data["products"];

    let raw = '';
    products.forEach(function (item, _) {
        raw += generateProductPreviewCard(item);
    });
    let latestProductsBox = $("#latestProducts");
    latestProductsBox.append(raw);
}

/*index.html END*/

/*products.html START*/

var fillCategoriesList = function (categories) {
    let categoryIdBox = $("#categoryId");
    let categoryId = categoryIdBox.val();

    let raw = '<a href="products.html?' + 'p=1&q=' + $("#currentQuery").val() + '" class="list-group-item list-group-item-action">Все категории</a>';

    categories.forEach(function (item, _) {

        raw += '<a href="products.html?tid=' + item["id"] + '&p=1&q=' + $("#currentQuery").val() + '" class="list-group-item list-group-item-action';

        if (categoryId === item["id"]) {
            let categoriesLbl = $("#categoriesLbl");
            categoriesLbl.text(item["name"]);
        }
        
        raw += '">' + item["name"] + ' (' + item["productsCount"] + ')</a>';
    });

    let categoriesList = $("#categoriesList");
    categoriesList.empty();
    categoriesList.append(raw);
}

var fillCategories = async function() {
    let requset = apiDomain + "main/GetCategories?parentId=" + booksBaseCategoryId;
    $.getJSON(requset, fillCategoriesList);
}

var parseQueryParams = function () {
    const url = new URL(window.location.href);
    const query = url.searchParams.get('q');
    const page = url.searchParams.get('p');
    const categoryId = url.searchParams.get('tid');

    let searchBox = $("#searchBox");
    searchBox.val(query);
    $("#currentQuery").val(query);
    let categoryIdBox = $("#categoryId");
    categoryIdBox.val(categoryId);
    let pageNumber = $("#currentPage");
    pageNumber.val(page ? page : 1);
}

const productsOnPage = 12;

var searchButtonClicked = function () {
    let searchBox = $("#searchBox");
    let searchQuery = searchBox.val();
    let categoryIdBox = $("#categoryId");
    const categoryId = categoryIdBox.val();
    window.location = genereateSearchUrl(1, searchQuery, categoryId);
}

var genereateSearchUrl = function (page, query, categoryId) {
    const url = new URL(window.location.href);
    return url.pathname + "?q=" + query + "&p=" + page + "&tid=" + categoryId;
}

var searchProducts = function () {
    let categoryIdBox = $("#categoryId");
    let categoryId = categoryIdBox.val();
    let searchBox = $("#searchBox");
    let query = searchBox.val();
    let tid = categoryId ? categoryId : booksBaseCategoryId;
    let pageNumber = $("#currentPage");
    let page = pageNumber.val();

    let searchRequset = apiDomain + "main/GetWithSubTid?c=" + productsOnPage + "&tid=" + tid + "&query=" + query + '&p=' + page;
    $.getJSON(searchRequset, fillSearchProductsResults);
}

var fillSearchProductsResults = function (data) {
    let searchBox = $("#currentQuery");
    let query = searchBox.val();
    let isTitleSet = false;
    if (document.title === "Free Books") {
        if (query) {
            document.title = 'Результаты поиска Купить: ' + query;
            isTitleSet = true;
        }
    }
    else {
        isTitleSet = true;
    }

    let products = data["products"];

    let raw = '';
    products.forEach(function (item, _) {
        if (!isTitleSet) {
            document.title = 'Результаты поиска Купить: ' + item["name"];
            isTitleSet = true;
        }

        raw += generateProductPreviewCard(item);
    });
    let productsBox = $("#productsBox");
    productsBox.empty();
    productsBox.append(raw);
}

var fillProductsTable = function () {
    parseQueryParams();

    fillCategories();
    searchProducts();
}

/*products.html END*/