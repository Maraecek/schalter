from time import sleep
from UUGear import *

UUGearDevice.setShowLogs(0)

device = UUGearDevice('UUGear-Arduino-3606-9222')

if device.isValid():
	device.setPinModeAsOutput(5)
	device.setPinModeAsOutput(6)
	device.setPinModeAsOutput(7)
	device.setPinHigh(5)
	device.setPinHigh(6)
	device.setPinHigh(7)
	
	for i in range(5):
		device.setPinLow(5)
		sleep(0.2)
		device.setPinLow(6)
		sleep(0.2)
		device.setPinLow(7)
		sleep(2)
		device.setPinHigh(5)
		sleep(0.2)
		device.setPinHigh(6)
		sleep(0.2)
		device.setPinHigh(7)
		sleep(2)
	
	#device.setPinModeAsInput(9)
	#print 'Pin 9 status=', device.getPinStatus(9)
	
	device.detach()
	device.stopDaemon()
else:
	print 'UUGear device is not correctly initialized.'