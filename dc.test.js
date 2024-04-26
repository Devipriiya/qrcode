(function () {
  // your page initialization code here
  // the DOM will be available here

  const doorId = "123456789";
  // const doorId = "100000009bcc1b2e";

  let socket;
  const form = document.getElementById("form");
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");
  let settings;
  function getOtp() {
    axios
      .post("/v1/app/dc/getOtp", {
        doorId: doorId,
      })
      .then(function (response) {
        // handle success

        messages.innerHTML = decodeURIComponent(
          atob(response.data.data).replaceAll("\n", "")
        );
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }

  function checkConectionStatus() {
    setTimeout(() => {
      axios
        .post("/v1/app/dc/checkConnectedStatus", {
          doorId: doorId,
        })
        .then(function (response) {
          // handle success
          console.log(response);
          const data = response.data.data;
          if (data.status == "active") {
            settings = data;
            initSocket(data.shopId, data.environment);
          } else {
            checkConectionStatus();
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    }, 5000);
  }

  function initSocket(shopId, env) {
    socket = io("/tawDC", {
      query: { env: env, shopId: shopId, doorId: doorId },
    });
    socket.on("openDoor", function (data, callback) {
      console.log("door open called");
      console.log(data);
      messages.innerHTML = decodeURIComponent(
        atob(data.data).replaceAll("\n", "")
      );
      initOpen();

      callback({ success: true });
      setTimeout(() => {
        socket.emit("startQr");
      }, 10000);
    });

    socket.on("showQr", function (data) {
      console.log("show qr called");

      if (data.success) {
        messages.innerHTML = decodeURIComponent(
          atob(data.data).replaceAll("\n", "")
        );
        // initOpen();

        // initAds();
      }
    });

    socket.on("updateContent", function (data) {
      console.log("update qr called");
      if (data.success) {
        console.log(data.data.elm);
        document.getElementById(data.data.elm).innerHTML = decodeURIComponent(
          data.data.data
        );
        // messages.innerHTML = decodeURIComponent(atob(data.data).replaceAll("\n", ""));
      }

      console.log(data);
    });

    form.addEventListener("submit", (e) => {
      console.log("inside");
      e.preventDefault();
      if (input.value) {
        socket.emit("rfidScan", input.value, function (data, callback) {
          console.log(res);
          messages.innerHTML = atob(data.data).replaceAll("\n", "");
          callback({ success: true });
          input.value = "success";
        });
      }
    });
  }

  getOtp();
  checkConectionStatus();
})();
