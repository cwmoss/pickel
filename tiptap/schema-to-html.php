<?php
require_once("vendor/autoload.php");
$data = json_decode(file_get_contents("test.json"), true);

print_r($data);

function find_mentions(array $node): array {
    $mentions = [];
    foreach ($node["content"] as $ch) {
        if ($ch["type"] == "mention") {
            $mentions[] = $ch["attrs"];
        }
        if ($ch["content"] ?? null) {
            $mentions = [...$mentions, ...find_mentions($ch)];
        }
    }
    return $mentions;
}

function find_mentions2(array $node): array {
    $mentions = flatmap("find_mentions2", $node["content"] ?? []);
    if ($node["type"] == "mention") {
        $mentions[] = $node["attrs"];
    }
    return $mentions;
}



function flatmap(callable $fn, array $array): array {
    return array_merge([], ...array_map($fn, $array));
}

class result {
    public array $typ;
}

print_r(find_mentions($data));
print_r(find_mentions2($data));

$ed = new \Tiptap\Editor([
    'extensions' => [
        new \Tiptap\Extensions\StarterKit(),
        new \Tiptap\Nodes\Mention(),
    ],
])->setContent($data);

$html = $ed->getHTML();
print $html;

$result = new result;
$ed->descendants(fn(&$node) => visit_node($node, $result));

function visit_node(object $node, result $result) {
    $result->typ[] = $node->type;
}

print_r($result);

/*
https://github.com/ueberdosis/tiptap/discussions/2569#discussioncomment-2235356
function getAllNodesAttributesByType(
    doc: ProseMirrorNode,
    nodeType: string,
): Array<NodeAttributes> {
    const result: Array<NodeAttributes> = []

    doc.descendants((node) => {
        if (node.type.name === nodeType) {
            result.push(node.attrs)
        }
    })

    return result
}

And for the official @tiptap/extension-mention you'd call it something like this:

getAllNodesAttributesByType(editor.state.doc, 'mention')

https://github.com/ueberdosis/tiptap/discussions/990

function parseMentions(data) {
  const mentions = (data.content || []).flatMap(parseMentions)
  if (data.type === 'mention') {
    mentions.push(data.attrs.id)
  }
  return mentions
}

// how to use:
parseMentions(editor.getJSON())

function parseMentions(data) {
  const mentions = (data.content || []).flatMap(parseMentions)
  if (data.type === 'mention') {
    mentions.push(data.attrs.id)
  }

  const uniqueMentions = [...new Set(mentions)]

  return uniqueMentions
}

*/
