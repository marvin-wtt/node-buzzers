import test from "ava";
import { HID } from "node-hid";
import sinon from "sinon";

import connectDevice from "../src/connectDevice";
const usbDevice = {} as HID;

test("connectDevice with vendorId and productId", (t) => {
  const nodeHid = {
    HID: sinon.stub().returns(usbDevice),
  };
  const device = connectDevice(nodeHid);
  t.is(device, usbDevice);
});

test("connectDevice by name after vendorId and productId attempt failed", (t) => {
  const nodeHid = {
    HID: sinon.stub(),
    devices: sinon.stub().returns([
      {
        product: "foo",
      },
      {
        product: "Sony Buzz! Wireless",
        vendorId: 1,
        productId: 2,
      },
    ]),
  };
  nodeHid.HID.onFirstCall().throws("device not found");
  nodeHid.HID.withArgs(1, 2).returns(usbDevice);
  const device = connectDevice(nodeHid);
  t.is(device, usbDevice);
});
