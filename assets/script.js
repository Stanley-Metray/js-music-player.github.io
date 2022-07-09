
$(document).ready(() => {

    const jsmediatags = window.jsmediatags;
    const PlayList = new Array();
    const input = document.createElement("input");
    let counter=-1;
    input.type = "file";
    input.id = "input";
    input.accept = ".mp3, .wav";

    let audio = new Audio();
    audio.preload = true;
    const progressBar = document.getElementById("progressBar");

    $("#btn-play").click(function () {
        if(audio.src!="")
        {
            if (audio.paused) {
                $(this).removeClass("fa-play-circle");
                $(this).addClass("fa-pause-circle");
                audio.play();
                $("#equilizer").css("width", "100px");
            }
            else {
                $(this).removeClass("fa-pause-circle");
                $(this).addClass("fa-play-circle");
                audio.pause();
                $("#equilizer").css("width", "0px");
            }
        }
    });

    audio.addEventListener("timeupdate", () => {
        let progress = parseInt((audio.currentTime / audio.duration) * 100);
        progressBar.value = progress;
        if(progress==100)
        {
            progressBar.value=0;
            $("#btn-play").addClass("fa-play-circle");
            $("#btn-play").removeClass("fa-pause-circle");
            $("#equilizer").css("width", "100px");
        }
    });

    progressBar.addEventListener("change", () => {
        audio.currentTime = progressBar.value * audio.duration / 100;
    });

    $("#btn-open-file").click((e) => {
        input.click();
    });

    $(input).change((event) => {
       
        counter++;
        const file = event.target.files[0];
        const urlObj = URL.createObjectURL(file);
        PlayList.push(urlObj);

        audio.addEventListener("load", () => {
            URL.revokeObjectURL(urlObj);
        });

        audio.src = urlObj;
        audio.play();
        $("#equilizer").css("width", "100px");
        $("#btn-play").addClass("fa-pause-circle");
        $("#btn-play").removeClass("fa-play-circle");
        jsmediatags.read(file, {
            onSuccess: function (tag) {
                // console.log(tag.tags.TPE1.data);
                // console.log(tag.tags.TPE2.data);
                if(tag.tags.TSSE==undefined)
                {
                const data = tag.tags.picture.data;
                const format = tag.tags.picture.format;
                let base64String = "";

                for (let i = 0; i < data.length; i++)
                    base64String += String.fromCharCode(data[i]);
                    document.querySelector("#cover").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;

                $("#musicDirector").text(tag.tags.TPE2.data);
                }
                else
                {
                    $("#musicDirector").text("Unknown");
                    $("#cover").css({
                        "background":"url(./bgs/default-cover.jpg)",
                        "background-size": "100% 100%",
                        "background-position": "center"
                    });
                }

                $("#title").text(tag.tags.title);
                $("#album").text(tag.tags.album);
                $("#artist").text(tag.tags.artist);
                
                if (tag.tags.title != undefined)
                    $("#title").text(tag.tags.title);
                else
                    $("#title").text("Unknown");
                
                if (tag.tags.album != undefined)
                    $("#album").text(tag.tags.album);
                else
                    $("#album").text("Unknown");
                
                if (tag.tags.artist != undefined)
                    $("#artist").text(tag.tags.artist);
                else
                    $("#artist").text("Unknown");

                if (tag.tags.year != undefined)
                    $("#year").text(tag.tags.year);
                else
                    $("#year").text("Unknown");
            },
            onError: function (error) {
                console.log(error);
            }
        });

    });

});