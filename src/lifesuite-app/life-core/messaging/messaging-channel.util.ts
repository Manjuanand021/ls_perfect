const ChannelIdDelimiter = '-';

export class MessagingChannelUtil {
    public static getDynamicChannelId(fixedId: string, dynamicId: string): string {
        return `${fixedId}${ChannelIdDelimiter}${dynamicId}`;
    }
}
