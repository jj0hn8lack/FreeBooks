// const apiDomain = "https://ufostore.herokuapp.com/";
const apiDomain = "https://ufoback.herokuapp.com/";
const booksBaseCategoryId = 121;

var generateCouponCard = function (coupon) {
    let code = coupon["code"] ? coupon["code"] : 'Не требуется';
    let activateLink = coupon["url"].replace('http://xf.gdeslon.ru/ck', '/coupon');

    let raw = '<div class="col-md-4"><div class="product-item"><div class="down-content"><hr />';
    raw += '<div class="coupon-title"><h5>' + coupon["merchantName"] + '</h5></div><hr />';
    raw += '<div class="coupon-card-code"><h3>Код: ' + code +'</h3></div><br />';
    raw += '<a href="' + activateLink + '"><h4>' + coupon["name"] + '</h4></a>';
    raw += '<p>' + coupon["startDateTime"] + ' &mdash; ' + coupon["finishDateTime"] + '</p>';
    raw += '<a href="' + activateLink + '" class="btn btn-success btn-block">Активировать</a>';
    raw += '<button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#exampleModal" data-description="' + coupon["instruction"].replaceAll('"', '\'') + '">Подробнее</button>';
    raw += '</div></div></div>';
    return raw;
}

var generateCouponsTable = function (data) {
    let coupons = data["coupons"];
    let raw = '';

    coupons.forEach(function (item, _) {
        raw += generateCouponCard(item);
    });

    let couponsBox = $("#couponsBox");
    couponsBox.append(raw);

}

var fillCouponsTable = function () {
    let searchRequset = apiDomain + "stocks/Category?categoryId=" + booksBaseCategoryId;
    $.getJSON(searchRequset, generateCouponsTable);
}
