//Mascaras de input
document.addEventListener("DOMContentLoaded", function () {
    //Mascara para macaddress aceitando somente hexadecimal
    var macMask = IMask(document.getElementById('mac'), {
        mask: /^[0-9a-f]{0,12}$/i
    });
    //Mascaras para ip, aceitando somente numeros até a casa da centena
    var ip1Mask = IMask(document.getElementById('ip1'),{
        mask: /^[0-9]{0,3}$/i
    });
    var ip2Mask = IMask(document.getElementById('ip2'),{
        mask: /^[0-9]{0,3}$/i
    });
});