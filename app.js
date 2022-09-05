const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const playlist = $('.playlist');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Beautiful In White",
            singer: "Shane Filan",
            path: "./assets/music/BeautifulInWhite-ShaneFilan-524801.mp3",
            image: "./assets/img/BeautifulInWhite.jpg"
        },
        {
            name: "Full House",
            singer: "Bi Rain",
            path: "./assets/music/FullHouse-BiRain_jqc3.mp3",
            image: "./assets/img/FullHouse.jpg"
        },
        {
            name: "Girls Like You",
            singer: "Maroon 5 ft. Cardi B",
            path: "./assets/music/GirlsLikeYou-Maroon5CardiB-5519390_hq.mp3",
            image: "./assets/img/GirlsLikeYou.jpg"
        },
        {
            name: "I Like You So Much You Will Know It",
            singer: "Ysabelle Cuevas",
            path: "./assets/music/ILikeYouSoMuchYoullKnowItEnglishCover-YsabelleCuevas-5825523.mp3",
            image: "./assets/img/ILYSMYKI.jpg"
        },
        {
            name: "I'm Yours",
            singer: "Jason Mraz",
            path: "./assets/music/IMYours-JasonMraz-6274784_hq.mp3",
            image: "./assets/img/ImYours.jpg"
        },
        {
            name: "Just The Way You Are",
            singer: "Bruno Mars",
            path: "./assets/music/JustTheWayYouAre-BrunoMars-6279961_hq.mp3",
            image: "./assets/img/JustTheWayYouAre.jpg"
        },
        {
            name: "One Call Away",
            singer: "Charlie Puth",
            path: "./assets/music/OneCallAway-CharliePuth-6426097_hq.mp3",
            image: "./assets/img/OneCallAway.jpg"
        },
        {
            name: "Perfect Two",
            singer: "Auburn",
            path: "./assets/music/PerfectTwo-Auburn_m2bs.mp3",
            image: "./assets/img/PerfectTwo.jpg"
        },
        {
            name: "You Belong With Me",
            singer: "Taylor Swift",
            path: "./assets/music/YouBelongWithMe-TaylorSwift-5809964_hq.mp3",
            image: "./assets/img/YouBelongWithMe.jpg"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })

    },
    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        // Xử lý zoom in/ zoom out CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Khi bài hát playing
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Khi bài hát pausing
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        // Xử lý khi seek
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // Khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong();
            _this.render();
        }
        // Khi prev bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong();
            _this.render();
        }
        // Xử lý Random bật / tắt
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // Xử lý repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // Xử lý song khi ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }

        }
        // Lắng nghe hành vi click vào song
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || !e.target.closest('.option')) {
                if (e.target.closest('.song:not(.active)')) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',

            })
            console.log(123);
        }, 300)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe/ xử lý các sự kiện
        this.handleEvent();

        // Click qua bài
        this.nextSong();

        // Click quay lại
        this.prevSong();

        // Tải thông tin bài hát đầu tiên trên UI khi chạy app
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của randomBtn và repeatBtn
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}
app.start();



