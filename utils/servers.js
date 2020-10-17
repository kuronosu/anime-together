const { ANIMES_END_POINT } = require("../constants/api")

function gocdnServer(anime_flvid, episode_number) {
    return `${ANIMES_END_POINT}/${anime_flvid}/episodes/${episode_number}/gocdn`
}

module.exports = {
    gocdn: gocdnServer
}