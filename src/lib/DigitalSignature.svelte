<script context="module">
  export let sig;
  export const rsaPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCJeyGhdOCJpLCkaZVuuFW+TxPUE7ohTxe9LFvSS8XErg0x0MME
bPRA915e5BKkPxXEMwc4Y3G1uO3Qj37nrxxfRg0idakywYNV/FSqKB8eLiY8ESMh
z5xbHn60SqxjFA02inX/zrCfLUnRQQjkQmSEUAerVqpsgbIf8H5ewiRJoQIDAQAB
AoGAQxC/7SU4y6x9RxcCgIqHuViWEaS17b3JlMzo1gOErFdDtINkPupvlKmXba7Q
sTLdCWLjKMzKEZ3u1QjLHXY83j4fckdSQwMOX/oGk8qo8TIv0C2+n2DHpfWvPAZY
oEJnnQgTQ4ctLpgtbP85zmNi51AhFif3+dINTSNsXh8zhIkCQQC97yQXS19dHeOs
ZNkJPZQeu/g1l9ShlqiR8ZPUPNssun8jDuZjIKpoaI1QHGeO0kw7k2KWnKYHvZVu
JlKRR0M3AkEAuU1ALyZhDOlCAfy+EaF24ZaLLQ3c5z5ierNz+/rK5vSuRyFPHW92
p+y06/wWvYWseAAXzMTH0kj6i11FrBX15wJAfJ3FqT77r8WnlnmIaOatI0ki/k7C
5M5LhY3h9zOCfiNSvTbOdCV/iQdoCDLKw0s5VzFJUxYuXQ/HVkDwlX8TGwJAHcAT
X/6Pcl045czIT1hXF9ztt2wUXWQct4p8QqZ/URlTqcPlSdqNeGR+n6y3kfIWQKXz
LEMjudVRtHJjLz/PXQJBAIO0t2o1pLXkDDvoOaUZBlOb3txg11ycZmIh60itkWOg
PG2SvMIKM2Z5ywbCptQpsmaUp5l4NTmBTC1g8qH24D4=
-----END RSA PRIVATE KEY-----
`;
</script>

<script>
  import { onMount } from "svelte";
  const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJeyGhdOCJpLCkaZVuuFW+TxPU
E7ohTxe9LFvSS8XErg0x0MMEbPRA915e5BKkPxXEMwc4Y3G1uO3Qj37nrxxfRg0i
dakywYNV/FSqKB8eLiY8ESMhz5xbHn60SqxjFA02inX/zrCfLUnRQQjkQmSEUAer
VqpsgbIf8H5ewiRJoQIDAQAB
-----END PUBLIC KEY-----
`;

  onMount(() => {
    let script = document.createElement("script");
    script.src = "http://kjur.github.io/jsrsasign/jsrsasign-latest-all-min.js";
    document.head.append(script);

    script.onload = function () {
      // initialize
      sig = new KJUR.crypto.Signature({ alg: "SHA1withRSA" });
      // initialize for signature generation
      sig.init(rsaPrivateKey); // rsaPrivateKey of RSAKey object
      console.log("Inicializováno");
    };
  });

  // update data
  // sig.updateString("aaa");
  // calculate signature
  // var sigValueHex = sig.sign();
</script>
