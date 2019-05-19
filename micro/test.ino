#include "Particle.h"

SYSTEM_MODE(SEMI_AUTOMATIC);

void setup(){
	Serial.begin(9600);
}

void loop(){
	static uint32_t lastPrint = 0;
	if(millis() - lastPrint > 1000){
		static uint32_t count = 0;
		Serial.printlnf("Count: %d", count++);
		lastPrint = millis();
	}
}