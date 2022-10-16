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
            }
        })
    }
})