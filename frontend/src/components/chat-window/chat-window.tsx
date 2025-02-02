import { Stack, Text } from '@chakra-ui/react';
import { Message } from './message';
import { CSSProperties, useEffect, useMemo, useRef } from 'react';
import { CellMeasurer, CellMeasurerCache, List, AutoSizer} from 'react-virtualized';

type Props = {
    messages: Message[];
}

export const ChatWindow = ({
    messages
}: Props) => {

    const windowRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);
    const newChat = useMemo(() => messages.length === 0, [messages]);
    const cache = new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 100
    });

    useEffect(() => {
        listRef.current?.scrollToRow(messages.length - 1);
    }, [messages])

    const MessageRow = ({ index, style, parent }: { index: number, style: CSSProperties, parent: any }) => (
        <CellMeasurer
            cache={cache}
            columnIndex={0}
            key={index}
            parent={parent}
            rowIndex={index}
        >
            {({ registerChild }) => (
                <div
                    ref={registerChild}
                    style={style}
                >
                    <Message
                        {...messages[index]}
                    />
                </div>
            )}
        </CellMeasurer>
    );

    return (
        <Stack
            direction="column"
            gap={4}
            w="100%"
            h="90%"
            p={4}
            borderRadius="md"
            alignItems={newChat ? "center" : "flex-start"}
            justifyContent={newChat ? "center" : "flex-start"}
            overflowY="auto"
            ref={windowRef}
        >
            {
                messages.length > 0 ? (
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                ref={listRef}
                                height={height}
                                rowCount={messages.length}
                                rowHeight={cache.rowHeight}
                                deferredMeasurementCache={cache}
                                width={width}
                                rowRenderer={MessageRow}
                                overscanRowCount={3}
                            />
                        )}
                    </AutoSizer>
                ) : (
                    <Text
                        fontSize="lg"
                        color="gray.600"
                    >
                        Hey, how can I help you today?
                    </Text>
                )
            }
        </Stack>
    )
}