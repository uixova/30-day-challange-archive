function openInfoPanel(movieData) {
    const panel = document.getElementById('infoPanel');
    panel.style.display = 'flex';
    // document.getElementById('panel-title').innerText = movieData.title;
}

document.getElementById('closePanel').addEventListener('click', () => {
    document.getElementById('infoPanel').style.display = 'none';
});