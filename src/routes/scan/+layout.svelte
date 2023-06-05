<header>
  <a href="/">
    <h1>QR SIGN!</h1>
  </a>
</header>

<div class="container"><slot /></div>

<style>
  header {
    width: 100%;
    text-align: center;
    border-bottom: rgba(0, 0, 0, 0.199) solid 1px;
  }
  h1 {
    margin: 10px 40px;
  }
  .container {
    padding: 15px;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
</style>
