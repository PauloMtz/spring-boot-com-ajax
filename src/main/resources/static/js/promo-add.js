$("#linkPromocao").on("change", function() {
    var url = $(this).val();

    if (url.length > 7) {
        $.ajax({
            method: "POST",
            url: "/meta/info?url=" + url,
            cache: false,
            success: function(dados) {
                console.log(dados);
                $("#titulo").val(dados.title);
                $("#site").text(dados.site.replace("@", ""));
                $("#linkImagem").attr("src", dados.image);
            },
            statusCode: {
                404: function() {
                    $("#alert").addClass("alert alert-danger").text("Erro 404: Nenhuma informação retornada.");
                },
                500: function() {
                    $("#alert").addClass("alert alert-danger").text("Erro 500: Nenhuma informação retornada.");
                },
                error: function() {
                    $("#alert").addClass("alert alert-danger").text("Error: Nenhuma informação retornada.");
                }
            }
        })
    }
})