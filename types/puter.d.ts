interface PuterUser {
    username: string;
    email?: string;
    id: string;
}

interface FSItem {
    id: string;
    name: string;
    path: string;
    size?: number;
    isDirectory?: boolean;
    created?: string;
    modified?: string;
}

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string | MessageContent[];
}

interface MessageContent {
    type: "text" | "file" | "image_url";
    text?: string;
    puter_path?: string;
    image_url?: string;
}

interface PuterChatOptions {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}

interface AIResponse {
    message: {
        role: string;
        content: string | MessageContent[];
    };
    usage?: {
        input_tokens?: number;
        output_tokens?: number;
    };
}

interface KVItem {
    key: string;
    value: string;
}
