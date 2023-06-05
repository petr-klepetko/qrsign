<div id="page-container">
  <div class="main"><slot /></div>
  <footer>2023, Petr Klepetko, VŠE</footer>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: "Courier New", Courier, monospace;
  }
  #page-container {
    position: relative;
    min-height: 100vh;
  }
  .main {
    padding-bottom: 2.5rem;
    position: absolute;
    width: 100%;
  }
  footer {
    width: 100%;
    background: rgba(0, 0, 0, 0.199);
    position: absolute;
    bottom: 0;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
