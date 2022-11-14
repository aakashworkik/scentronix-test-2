const server = require("./index")

test('no server given in the arguments', async () => {
    try {
      await server.findServer();
    } catch (e) {
      expect(e).toMatch('Servers not found');
    }
});

jest.setTimeout(6000)
test('no server are online', async () => {
    try {
      await server.findServer([
        {
          "url": "https://does-not-work.perfume.new",
          "priority": 1
        },
        {
          "url": "https://gitlab.com",
          "priority": 4
        },
        {
          "url": "http://app.scnt.me",
          "priority": 3
        },
        {
          "url": "https://offline.scentronix.com",
          "priority": 2
        }
      ]);
    } catch (e) {
        expect(e).toMatch('Servers are offline');
    }
});

test('one server is online', async () => {
       let response = await server.findServer([
        {
            "url": "https://www.myntra.com",
            "priority": 3
        },
        {
            "url": "https://www.amazon.com",
            "priority": 2
        },{
            "url": "https://www.flipkart.com",
            "priority": 1
        }
      ]);
      expect(response).toMatch('https://www.flipkart.com');
});
  
  