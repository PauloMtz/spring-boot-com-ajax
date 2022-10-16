// submit do formulário para o controller
$("#form-add-promo").submit(function(event) {
    event.preventDefault(); // para não gerar refresh no navegador

    // recebe os dados do formulário e armazena na variável promo
    var promo = {};
    promo.linkPromocao = $("#linkPromocao").val();
    promo.descricao = $("#descricao").val();
    promo.preco = $("#preco").val();
    promo.titulo = $("#titulo").val();
    promo.categoria = $("#categoria").val();
    promo.linkImage = $("#linkImagem").attr("src");
    promo.site = $("#site").text();

    console.log(">>> promo: ", promo);

    $.ajax({
        method: "POST",
        url: "/promocao/save",
        data: promo,
        success: function() {
            $("#alert").addClass("alert alert-success").text("Promoção cadastrada com sucesso.");
        },
        error: function(xhr) {
            console.log(">>> erro: ", xhr.responseText);
            $("#alert").addClass("alert alert-danger").text("Não foi possível cadastrar a promoção.");
        }
    })
})

// função para capturar as meta tags
$("#linkPromocao").on("change", function() {
    var url = $(this).val();

    if (url.length > 7) {
        $.ajax({
            method: "POST",
            url: "/meta/info?url=" + url,
            cache: false,
            beforeSend: function() {
                $("#alert").removeClass("alert alert-danger").text("");
                $("#titulo").val("");
                $("#site").text("");
                $("#linkImagem").attr("src", "");
                $("#loader-img").addClass("loader");
            },
            success: function(dados) {
                console.log(dados);
                $("#titulo").val(dados.title);
                $("#site").text(dados.site.replace("@", ""));
                $("#loader-img").removeClass("loader");
                $("#linkImagem").attr("src", dados.image);
            },
            statusCode: {
                404: function() {
                    $("#alert").addClass("alert alert-danger").text("Erro 404: Nenhuma informação retornada.");
                    $("#loader-img").removeClass("loader");
                    $("#linkImagem").attr("src", "/images/promo-dark.png");
                },
                500: function() {
                    $("#alert").addClass("alert alert-danger").text("Erro 500: Nenhuma informação retornada.");
                    $("#loader-img").removeClass("loader");
                    $("#linkImagem").attr("src", "/images/promo-dark.png");
                },
                error: function() {
                    $("#alert").addClass("alert alert-danger").text("Error: Nenhuma informação retornada.");
                    $("#loader-img").removeClass("loader");
                    $("#linkImagem").attr("src", "/images/promo-dark.png");
                }
            }
        })
    }
})