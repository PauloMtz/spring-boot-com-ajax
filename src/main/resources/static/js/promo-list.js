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