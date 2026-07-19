const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

dns.resolveSrv("_mongodb._tcp.proyectofinal.0xuxuy3.mongodb.net", (err, records) => {
  if (err) {
    console.error("ERROR:", err);
    return;
  }

  console.log(records);
});