<script>
  export const href = "/";
</script>

<div class="arrow" on:click on:keypress>
  <a href>
    <img src="/src/img/left-arrow.png" height="10px" alt="<" />Back
  </a>
</div>

<style>
  a {
    text-decoration: none;
    color: inherit;
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }
  .arrow {
    margin-bottom: 20px;
    position: relative;
    width: fit-content;
    padding: 2px;
    padding-right: 5px;
  }
  .arrow:hover {
    border-bottom: solid 0.5px black;
    border-right: solid 0.5px black;
  }
  .arrow:active {
    border-bottom: solid 0.5px black;
    border-right: solid 0.5px black;
    color: white;
    background-color: black;
  }
  img {
    margin-right: 10px;
  }
</style>
