fetch("http://localhost:3000/stats")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("online").textContent = data.online ?? "--";
    document.getElementById("total").textContent = data.total ?? "--";
  })
  .catch(() => {
    document.getElementById("online").textContent = "--";
    document.getElementById("total").textContent = "--";
  });
