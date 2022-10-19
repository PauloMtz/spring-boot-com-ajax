var numPage = 0;

// quando carrega a página
$(document).ready(function() {
    $("#loader-img").hide();
    $("#fim-btn").hide();
});

// efeito infinite scroll
// pega a tela toda pela propriedade 'window'
$(window).scroll(function() {
    // esse $(this) se refere ao $(window)
    var scrolltop = $(this).scrollTop();

    // esse $(document) se refere ao conteúdo da tela
    var conteudo = $(document).height() - $(window).height();

    // tem que baixar a barra de rolagem para aparecer no console
    console.log("scrolltop: ", scrolltop, " ; conteúdo: ", conteudo);

    if (scrolltop >= conteudo) {
        numPage++;
        setTimeout(function() {
            loadByScrollBar(numPage)
        }, 500) // meio segundo
    }
});

function loadByScrollBar(numPage) {
    $.ajax({
        method: "GET",
        url: "/promocao/list/scroll",
        data: {
            page: numPage
        },
        beforeSend: function() {
            $("#loader-img").show();
        },
        success: function(response) {
            //console.log(">>> resposta: ", response);

            if (response.length > 150) {
                $(".row").fadeIn(250, function() {
                    // esse $(this) se refere ao $(".row")
                    $(this).append(response);
                });
            } else {
                $("#fim-btn").show();
                $("#loader-img").removeClass("loader");
            }
        },
        error: function(xhr) {
            alert("Erro " + xhr.status + ": " + xhr.statusText);
        },
        complete: function() {
            $("#loader-img").hide();
            //$("#fim-btn").show();
        }
    })
}

// autocomplete
$("#autocomplete-input").autocomplete({
    source: function(request, response) {
        $.ajax({
            method: "GET",
            url: "/promocao/site",
            data: {
                termo: request.term
            },
            success: function(result) {
                response(result);
            }
        });
    }
});

// quando clicar no botão da pesquisa
$("#autocomplete-submit").on("click", function() {
    // pega o valor do campo de input
    var site = $("#autocomplete-input").val();

    $.ajax({
        method: "GET",
        url: "/promocao/site/list",
        data: {
            site: site
        },
        beforeSend: function() {
            numPage = 0;
            $("#fim-btn").hide();
            $(".row").fadeOut(500, function() {
                $(this).empty(); // limpa o que estiver em $(".row")
            });
        },
        success: function(response) {
            $(".row").fadeIn(250, function() {
                $(this).append(response); // acrescenta a resposta em $(".row")
            });
        },
        error: function(xhr) {
            alert("Erro " + xhr.status + ": " + xhr.statusText);
        }
    });
});

// adicionar likes
// pega qualquer botão que tenha id = likes-btn-
$(document).on("click", "button[id*='likes-btn-']", function() {
    // pega $(this) button com atributo id, separado por traço e pega o indice 2
    var id = $(this).attr("id").split("-")[2];

    //console.log(">>> Id: ", id);

    $.ajax({
        method: "POST",
        url: "/promocao/like/" + id,
        success: function(response) {
            $("#likes-count-" + id).text(response);
        },
        error: function(xhr) {
            alert("Erro " + xhr.status + ": " + xhr.statusText);
        }
    });
});
