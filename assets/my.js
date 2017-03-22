var texts = {
    "basic": "請所有人閉上雙眼，請所有壞人睜開眼睛確認彼此身份，3，2，1，請所有壞人閉上眼睛，請所有壞人豎起你的大拇指，請梅林睜開眼睛確認壞人身份，3，2，1，請壞人收起大拇指，請梅林閉上眼睛，遊戲開始"

};

$(function() {
    var hash,changeFlag = false;
    var speed, PitchSign, Speaker, PitchLevel, PitchScale;

    if (window.location.hash) {
        hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        var urlSetting = JSON.parse('{"' + decodeURI(hash).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
            //console.log(urlSetting);
        for (var i in urlSetting) {
            $("input[name='" + i + "'][type='range']").val(urlSetting[i]);
            $("input[name='" + i + "'][type='radio'][value='" + urlSetting[i] + "']").prop('checked', true);
            $("input[name='" + i + "'][type='hidden']").val(urlSetting[i]);
            if (urlSetting[i] == '0') {
                $(".click-card[data-role='" + i + "']").addClass('hover');
            }
            //console.log("input[name='" + i + "']",urlSetting[i]);
        }

    }
    refreshSetting();

    $("body").on("change", "input", function() {
        window.location.hash = $("#settings").serialize();
        refreshSetting();
    });

    $(".click-card").click(function() {
        var role = $(this).data("role");
        $(this).toggleClass("hover");
        $("input[name='" + role + "']").val($(this).hasClass("hover") ? '0' : '1').trigger("change");
    });

    $('#play-voice').click(function() {
        $("#sheep-text").text(texts.basic);
        var audio = $("#media audio");
        if(changeFlag == false && audio){
            audio[0].play();
            return;
        }

        var tts = new TTS();
        tts.muteTag = "id:mute|class:mute";
        tts.PlayerSet.hidden = false;
        tts.PlayerSet.width = 100;
        tts.PlayerSet.height = 30;
        tts.ConvertInit("id:sheep-text", "media", Speaker, "100", speed, PitchLevel, PitchSign, PitchScale);


        $("#media img").trigger("click");
        changeFlag = false;
        console.log(speed, PitchSign);
    });

    $('#reset').click(function() {
        $('#media').html('');
        $('form#settings')[0].reset();
        $(".click-card").removeClass('hover');
        $("input").trigger("change");
    });

    $("#share").jsSocials({
        shares: ["twitter", "facebook", "messenger", "line"]
    });

    function refreshSetting() {
        changeFlag = true;
        speed = $("input[name='speed']").val();
        PitchSign = $("input[name='PitchSign']:checked").val();
        Speaker = $("input[name='Speaker']:checked").val();
        PitchLevel = $("input[name='PitchLevel']").val();
        PitchScale = $("input[name='PitchScale']").val();
        $("#speed").text(speed);
        $("#PitchLevel").text(PitchLevel);
        $("#PitchScale").text(PitchScale);
    }
});
