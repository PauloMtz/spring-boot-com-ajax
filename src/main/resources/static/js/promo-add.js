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
    promo.linkImagem = $("#linkImagem").attr("src");
    promo.site = $("#site").text();

    console.log(">>> promo: ", promo);

    $.ajax({
        method: "POST",
        url: "/promocao/save",
        data: promo,
        beforeSend: function() {
            // removendo as mensagens
            $("span").closest(".error-span").remove();

            // removendo as bordas vermelhas
            $("#categoria").removeClass("is-invalid");
            $("#preco").removeClass("is-invalid");
            $("#linkPromocao").removeClass("is-invalid");
            $("#titulo").removeClass("is-invalid");

            // habilita o loader
            $("#form-add-promo").hide();
            $("#loader-form").addClass("loader").show();
        },
        success: function() {
            $("#form-add-promo").each(function() {
                this.reset(); // limpa os campos do formulário
            })
            $("#linkImagem").attr("src", "/images/promo-dark.png"); // limpa a imagem
            $("#site").text(""); // limpa o nome do site
            $("#alert")
                .removeClass("alert alert-danger")
                .addClass("alert alert-success")
                .text("Promoção cadastrada com sucesso.");
        },
        statusCode: {
            422: function(xhr) {
                console.log(">>> Status error: ", xhr.status);
                var errors = $.parseJSON(xhr.responseText);
                $.each(errors, function(key, val) {
                    $("#" + key).addClass("is-invalid");
                    $("#error-" + key)
                        .addClass("invalid-feedback")
                        .append("<span class='error-span'>" + val + "</span>");
                });
            }
        },
        error: function(xhr) {
            console.log(">>> erro: ", xhr.responseText);
            $("#alert").addClass("alert alert-danger").text("Não foi possível cadastrar a promoção.");
        },
        complete: function() {
            $("#loader-form").fadeOut(800, function() {
                $("#form-add-promo").fadeIn(250);
                $("#loader-form").removeClass("loader");
            })
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
                $("#alert").removeClass("alert alert-danger alert-success").text("");
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