// Slider navigation logic
(function () {
    const radios = Array.from(
        document.querySelectorAll('input[name="slide"]')
    );
    if (!radios.length) return;

    function currentIndex() {
        return radios.findIndex((r) => r.checked);
    }

    function go(step) {
        const idx = (currentIndex() + step + radios.length) % radios.length;
        radios[idx].checked = true;
    }

    const prev = document.querySelector(".arrows .prev");
    const next = document.querySelector(".arrows .next");

    if (prev)
        prev.addEventListener("click", function (e) {
            e.preventDefault();
            go(-1);
        });

    if (next)
        next.addEventListener("click", function (e) {
            e.preventDefault();
            go(1);
        });
})();
