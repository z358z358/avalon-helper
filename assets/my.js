$(function() {
    var hash, changeFlag = false,
        playingFlag = false;
    var speed, PitchSign, Speaker, PitchLevel, PitchScale;
    var oberon, mordred, percival, mormna;
    var checkList = ['oberon', 'mordred', 'percival', 'mormna'];
    var voiceCount = 0,
        voices, audio;

    resizeHeight();
    $(window).resize(resizeHeight);

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
        if (playingFlag) {
            $('#play-voice').trigger('click');
        }
        window.location.hash = $("#settings").serialize();
        refreshSetting();
    });

    $(".click-card").click(function() {
        var role = $(this).data("role");
        if (role == 'percival' || role == 'mormna') {
            $(".together").toggleClass("hover");
        } else {
            $(this).toggleClass("hover");
        }
        $("input[type='hidden']").each(function() {
            $(this).val($(".click-card[data-role='" + $(this).attr('name') + "']").hasClass("hover") ? '0' : '1');
        });
        $("input[type='hidden']").trigger("change");
    });

    $('#play-voice').click(function() {
        // Setup the player to autoplay the next track
        voiceCount = 0;
        voices = audiojs.createAll();
        audio = voices[0];
        var audioSrc = $(".voices ." + Speaker + " span").data('src');
        console.log(audioSrc);
        audio.load(audioSrc);
        audio.play();
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

    function playVoice() {
        playingFlag = true;
        if (voiceCount >= 7) {
            voiceCount = 0;
            playingFlag = false;
            $("#play-voice").text('播放語音').removeClass('btn-danger');
            return;
        }
        // Setup the player to autoplay the next track
        var a = audiojs.createAll({
            trackEnded: function() {
                var next = $('.voices li.playing').next();
                if (!next.length) next = $('ol li').first();
                next.addClass('playing').siblings().removeClass('playing');
                audio.load($('a', next).attr('data-src'));
                audio.play();
            }
        });

        return;
        voices[voiceCount].playbackRate = speed;
        voices[voiceCount].play();
        voices[voiceCount].pause();

        setTimeout(function() {
            voices[voiceCount].currentTime = 0;
            voices[voiceCount].play();
        }, 2000);
    }

    function refreshSetting() {
        changeFlag = true;
        speed = $("input[name='speed']").val();
        PitchSign = $("input[name='PitchSign']:checked").val();
        Speaker = $("input[name='Speaker']:checked").val();
        PitchLevel = $("input[name='PitchLevel']").val();
        PitchScale = $("input[name='PitchScale']").val();
        oberon = $("input[name='oberon']").val();
        mordred = $("input[name='mordred']").val();
        percival = $("input[name='percival']").val();
        mormna = $("input[name='mormna']").val();
        $("#sheep-text .more").hide();
        for (var i = 0; i < checkList.length; i++) {
            var check = eval(checkList[i]);
            if (check == '1') {
                $(".only-" + checkList[i]).show();
            }

        }
        $("#speed").text(speed);
        $("#PitchLevel").text(PitchLevel);
        $("#PitchScale").text(PitchScale);
    }

    function resizeHeight() {
        $('.one-card').css('height', $('.back').height());
    }
});
