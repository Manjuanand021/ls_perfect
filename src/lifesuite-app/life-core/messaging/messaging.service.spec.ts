import { TestBed, inject } from '@angular/core/testing';

import { MessagingService } from './messaging.service';

describe('Messaging', () => {
    let msgService: MessagingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MessagingService]
        });
    });

    beforeEach(
        inject([MessagingService], (service: MessagingService) => {
            msgService = service;
        })
    );

    it('creates channels on publish', () => {
        expect(msgService.numberOfChannels).toEqual(0);
        msgService.publish('channel1', 'message1');
        expect(msgService.numberOfChannels).toEqual(1);
        msgService.publish('channel1', 'message2');
        expect(msgService.numberOfChannels).toEqual(1);
        msgService.publish('channel2', 'message3');
        expect(msgService.numberOfChannels).toEqual(2);
        msgService.publish('channel2', 'message4');
        expect(msgService.numberOfChannels).toEqual(2);
    });

    it('destroys channels on close', () => {
        msgService.publish('channel1', 'message1');
        msgService.publish('channel2', 'message2');
        expect(msgService.numberOfChannels).toEqual(2);
        msgService.closeChannel('channel1');
        expect(msgService.numberOfChannels).toEqual(1);
        msgService.closeChannel('channel2');
        expect(msgService.numberOfChannels).toEqual(0);
    });

    // TODO - find out why method subject.asObservable().map()
    // doesn't exist when running unit tests
    // it('creates channels on subscribe', done => {
    // 	msgService.publish('channel1', 'message1');
    // 	msgService.subscribe('channel1', message => {
    // 		expect(msgService.numberOfChannels).toEqual(1);
    // 		done();
    // 	});
    // });
});
