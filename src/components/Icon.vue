<script>
import { ref, h, onMounted } from 'vue';

export default {
  props: { name: String },

  setup(props) {
    const svgElement = ref(null);

    onMounted(() => {
      const svgContent = require(`/assets/icons/${props.name}.svg`).default;

      const parser = new DOMParser();
      svgElement.value = parser.parseFromString(
        svgContent,
        'image/svg+xml'
      ).documentElement;
    });

    function convertElementToVNode(node, isRoot = false) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes).map((child) =>
          convertElementToVNode(child)
        );
        const vnodeData = {
          ...Array.from(node.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value;
            return acc;
          }, {}),
          ns: 'http://www.w3.org/2000/svg', // SVG namespace
        };

        return h(node.tagName, vnodeData, children);
      } else if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue;
      }
      return null; // For other node types, return null for now.
    }

    return () => {
      if (svgElement.value) return convertElementToVNode(svgElement.value);
      else return null;
    };
  },
};
</script>
