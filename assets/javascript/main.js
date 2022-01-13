$(document).ready(function() {
    // let tokenId = "72f2af329fd45d9718ded9ccccded8e4";
    // let tokenId = "c1e9c12774a879280453102577757987";
    // let tokenId = "215fcb0c1938f2a39cd12461a932a2fe";
    // let tokenId = "38ac4b284101ded347b35f4e618252a9";

    // let tokenId = "bedc8ccf1f80409657fac159424884cd";
    let tokenId = "21bed58c9acdece3ea8e6c35a1594037";

    /**
     * @getTopHead get data from top head callback render code getTopHead(renderHtml)
     * @param {*} callback 
     */
    let getTopHead = (callback) => {
        let topHeaderApi = `https://gnews.io/api/v4/top-headlines?lang=en&token=${tokenId}`;
        fetch(topHeaderApi)
        .then(function (response) {
            return response.json();
        })
        .then((data) => {
            return data.articles;
        })
        .then(callback);
    }

    /**
     * @getSearchEndPoint get data from search end point callback getSearchEndPoint(renderHtml)
     * @param {*} callback 
     */
    let getSearchEndPoint = (callback) => {
        $("#searchBtn").on('click', () => {
            let searchIn = $("#modalSearch").val();
            let startDate = $('#modalStartDate').val();
            let endDate = $('#modalEndDate').val();

            if (searchIn === undefined || startDate === undefined || endDate === undefined) {
                alert("Please provide a search");
            } else {
                let apiSearch = `https://gnews.io/api/v4/search?q=${searchIn}&from=${startDate}&to=${endDate}&token=${tokenId}`;
                $('#modalLoading').show();
                fetch(apiSearch)
                .then(function (response) {
                    return response.json();
                })
                .then((data) => {
                    $('#modalLoading').hide();
                    $("#modalSearch").removeClass('error');
                    $("#modalSearchValidate").removeClass('error');
                    $('#modalSearchValidate').text("");
                    return data.articles;
                })
                .then(callback);
                $("#modalSearch").val('');
                $('.modal').removeClass('open');
            }
        });
    }

    /**
     * @renderHtml render html getTopHead & getSearchEndPoint
     */
    let renderHtml = (news) => {
        let html = news.map(item => {
        return `
        <div class="col l-4 m-6 c-12 mainItem">
                <img src="${item.image}" alt="${item.description}" class="mainItem__img">
                <div class="mainContent">
                    <a href="${item.url}" class="mainContent__link" target="_blank">${item.title}</a>
                    <p class="mainContent__time">${item.publishedAt}</p>
                    <p class="mainContent__title">${item.content}</p>
                    <a class="mainContent__link-source" href="${item.source.url}" target="_blank">${item.source.name}</a>
                </div>
            </div>
        `
        });
        $('#main .row').html(html.join(""));
    }

    /*-------currentDate-------- */
    /**
     * @currentDate get currentDate 
     */
    let currentDate = () => {
        let date = new Date();
        let days = date.getUTCDate();
        let month = date.getUTCMonth() + 1;
        let years = date.getUTCFullYear();
        if (month < 10) {month = '0' + month};
        if (days < 10) (days = '0' + days);
        let today = `${years}-${month}-${days}`;
        $('#modalStartDate').val(today);
        $('#modalEndDate').val(today);
    }

    /**
     * @showModal add class open to class modal
     */
    let showModal = () => {
        $('.modal').addClass("open");
    }

    /**
     * @hideModal remove class open to class modal
     */
    let hideModal = () => {
        $('.modal').removeClass("open");
    }

    /*------------------Validator--------------*/
    /**
     * @validateSearch 
     */
    let validateSearch = () => {
        let inSearch = $('#modalSearch');
        if (inSearch.val().length < 4) {
            $('#modalSearch').addClass('error');
            $('#modalSearchValidate').addClass('error');
            $('#modalSearchValidate').text('Không bỏ qua trường này! hãy nhập từ khóa tìm kiếm ');
        } else {
            $('#modalSearch').removeClass('error');
            $('#modalSearchValidate').removeClass('error');
            $('#modalSearchValidate').text("");
        }   
    }

    /**
     * @validateStartDate
     */
    let validateStartDate = () => {
        let fromDate = new Date($("#modalStartDate").val());
        let today = new Date();

        if (fromDate > today) {
            $('#modalStartDate').addClass('error');
            $('#modalStartDateValidate').addClass('error');
            $('#modalStartDateValidate').text('Khoảng thời gian này phải nhỏ hơn khoảng thời gian hiện tại');
        } else {
            $('#modalStartDate').removeClass('error');
            $('#modalStartDateValidate').removeClass('error');
            $('#modalStartDateValidate').text('');
        }
    }

    /**
     * @validateEndDate
     */
    let validateEndDate = () => {
        let fromDate = new Date($("#modalStartDate").val());
        let toDate = new Date($("#modalEndDate").val());
        let today = new Date();
            
        if (fromDate > toDate) {
            $('#modalEndDate').addClass('error');
            $('#modalEndDateValidate').addClass('error');
            $('#modalEndDateValidate').text('Khoảng thời gian này phải lớn hơn khoảng thời gian bắt đầu tìm kiếm!');
        } else if (toDate > today) {
            $('#modalEndDate').addClass('error');
            $('#modalEndDateValidate').addClass('error');
            $('#modalEndDateValidate').text('Khoảng thời gian này không được lớn hơn hiện tại!');
        }else {
            $('#modalEndDate').removeClass('error');
            $('#modalEndDateValidate').removeClass('error');
            $('#modalEndDateValidate').text('');
        }
    }

    /**
     * @validate Event
     */
    let validate = () => { 
        let modalSearch = $('#modalSearch');
        let startDate = $('#modalStartDate');
        let endDate = $('#modalEndDate');

        modalSearch.blur(validateSearch);
        startDate.blur(validateStartDate);
        endDate.blur(validateEndDate);

        modalSearch.keyup(validateSearch);
        startDate.keyup(validateStartDate);
        endDate.keyup(validateEndDate);
    
        $('#searchBtn').on('click', () => {
            if (validateSearch() && validateStartDate() && validateEndDate()) {
                return true;
            } else {
                return false;
            }
        });
    }

    /**
     * @start
     */
    let start = () => {
        getTopHead(renderHtml)
        getSearchEndPoint(renderHtml)
        currentDate()
        validate()
    }
    start()

    
    /* ---EVENT--- */
    $('.header__heading').on('click',function() {
        getTopHead(renderHtml);
    })

    $('.header__search').on('click', showModal);
    $('.modal').on('click', hideModal);
    $('.modal__close').on('click',hideModal);

    $(".modal__content").on('click', function(ev) {
        ev.stopPropagation()
    });
});