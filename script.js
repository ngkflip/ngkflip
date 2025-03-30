// Load Layout (Header + Footer)
fetch("layout.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("layout").innerHTML = data;
    });
