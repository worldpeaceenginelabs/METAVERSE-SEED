<script>
    export let title;
    export let text;
    export let link;
  
    // Create a reactive variable for shareData
    let shareData;
  
    // Use reactive statements to update shareData whenever any prop changes
    $: shareData = {
      title: title,
      text: text,
      url: link  // Use 'url' instead of 'link' for Web Share API
    };
  
    // Function to handle sharing
    async function shareText() {
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          console.log('Text shared successfully');
        } catch (error) {
          console.error('Error sharing text:', error);
        }
      } else {
        console.warn('Web Share API is not supported in this browser');
      }
    }
  </script>
  
  <!-- Add a button to trigger the share functionality -->
  <button on:click={shareText}>
    Share this Brainstorming
  </button>
  
  <style>
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
    }
  
    button:hover {
      background-color: #0056b3;
    }
  </style>
  