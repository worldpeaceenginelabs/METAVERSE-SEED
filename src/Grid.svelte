<script lang="ts">
  import { onMount } from 'svelte';

  let light;
  let messageElement;
  const messages = [
    "We are what we think. All that we are arises with our thoughts. With our thoughts, we make the world. - Buddha",
    "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world. - Albert Einstein",
    "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete. - Buckminster Fuller",
    "If you think we can't change the world, it just means you're not one of those who will. - Jacque Fresco",
    "Peace comes from within. Do not seek it without. - Buddha",
    "Life is like riding a bicycle. To keep your balance, you must keep moving. - Albert Einstein",
    "Don't fight forces, use them. - Buckminster Fuller",
    "The measure of the man is not his intellect, but his integrity. - Jacque Fresco",
    "In the middle of difficulty lies opportunity. - Albert Einstein",
    "There is nothing in a caterpillar that tells you it's going to be a butterfly. - Buckminster Fuller",
    "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment. - Buddha",
    "Life is like riding a bicycle. To keep your balance, you must keep moving. - Albert Einstein",
    "You never change things by fighting the existing reality. To change something, build a new model that makes the existing model obsolete. - Buckminster Fuller",
    "If you think we can’t change the world, it just means you’re not one of those that will. - Jacque Fresco",
    "Be the change that you wish to see in the world. - Mahatma Gandhi",
    "The time is always right to do what is right. - Martin Luther King Jr.",
    "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
    "Spread love everywhere you go. Let no one ever come to you without leaving happier. - Mother Teresa",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "The meaning of life is just to be alive. It is so plain and so obvious and so simple. And yet, everybody rushes around in a great panic as if it were necessary to achieve something beyond themselves. - Alan Watts",
    "This is the real secret of life -- to be completely engaged with what you are doing in the here and now. And instead of calling it work, realize it is play. - Alan Watts",
    "Nature is not our enemy, to be raped and conquered. Nature is ourselves, to be cherished and explored. - Terence McKenna",
    "The cost of sanity in this society, is a certain level of alienation. - Terence McKenna",
    "If you think we can't change the world, It just means you're not one of those that will. - Jacque Fresco",
    "The only limitations on the future of the humankind are those we impose upon ourselves. - Jacque Fresco",
    "The only thing more dangerous than ignorance is arrogance. - Albert Einstein",
    "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking. - Albert Einstein",
    "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration. - Nikola Tesla",
    "The only real wisdom is in knowing you know nothing. - Socrates",
    "I know that I am intelligent, because I know that I know nothing. - Socrates",
    "Man fears time, but time fears the pyramids. - Ancient Egyptian Proverb",
    "A beautiful thing is never perfect. - Ancient Egyptian Proverb",
    "The founders of Atlantis, he said, were half god and half human. They created a utopian civilization and became a great naval power. - Plato's account of Atlantis",
    "Perfection is not attainable, but if we chase perfection we can catch excellence. - Vince Lombardi",
    "The best preparation for tomorrow is doing your best today. - H. Jackson Brown, Jr.",
    "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart. - Helen Keller",
    "It is never too late to be what you might have been. - George Eliot",
    "There are two ways of spreading light: to be the candle or the mirror that reflects it. - Edith Wharton",
    "Start by doing what's necessary; then do what's possible; and suddenly you are doing the impossible. - Francis of Assisi",
    "Someone is sitting in the shade today because someone planted a tree a long time ago. - Warren Buffett",
    "I hated every minute of training, but I said, 'Don't quit. Suffer now and live the rest of your life as a champion.' - Muhammad Ali",
    "What lies behind you and what lies in front of you, pales in comparison to what lies inside of you. - Ralph Waldo Emerson",
    "Whatever you vividly imagine, ardently desire, sincerely believe, and enthusiastically act upon... must inevitably come to pass! - Paul J. Meyer",
    "Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared. - Buddha",
    "If you believe in yourself and have dedication and pride - and never quit, you'll be a winner. The price of victory is high but so are the rewards. - Bear Bryant",
    "Don't judge each day by the harvest you reap but by the seeds that you plant. - Robert Louis Stevenson",
    "No act of kindness, no matter how small, is ever wasted. - Aesop",
    "Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart. - Marcus Aurelius",
    "Hope is but the dream of those who wake. - Matthew Prior",
    "As we express our gratitude, we must never forget that the highest appreciation is not to utter words, but to live by them. - John F. Kennedy",
    "No matter what people tell you, words and ideas can change the world. - Robin Williams",
    "Put your heart, mind, and soul into even your smallest acts. This is the secret of success. - Swami Sivananda",
    "I've been absolutely terrified every moment of my life - and I've never let it keep me from doing a single thing I wanted to do. - Georgia O'Keeffe",
    "The only way to discover the limits of the possible is to go beyond them into the impossible. - Arthur C. Clarke",
    "Two roads diverged in a wood and I - I took the one less traveled by, and that has made all the difference. - Robert Frost",
    "Do your little bit of good where you are; it's those little bits of good put together that overwhelm the world. - Desmond Tutu",
    "I am so fresh in soul and spirit that life gushes and bubbles around me in a thousand springs. - Robert Schumann",
    "In a gentle way, you can shake the world. - Mahatma Gandhi",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Change your thoughts and you change your world. - Norman Vincent Peale",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "With the new day comes new strength and new thoughts. - Eleanor Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "The only thing we have to fear is fear itself. - Franklin D. Roosevelt",
    "Happiness is not something you postpone for the future; it is something you design for the present. - Jim Rohn",
    "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do. - Steve Jobs",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
    "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
    "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
    "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
    "Success is not in what you have, but who you are. - Bo Bennett",
    "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
    "Success is not just about making money. It's about making a difference. - Unknown",
    "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
    "There are no secrets to success. It is the result of preparation, hard work, and learning from failure. - Colin Powell",
    "Success seems to be connected with action. Successful people keep moving. They make mistakes, but they don't quit. - Conrad Hilton",
    "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will. - Vince Lombardi",
    "The secret of success is to do the common thing uncommonly well. - John D. Rockefeller Jr.",
    "I cannot give you the formula for success, but I can give you the formula for failure--It is: Try to please everybody. - Herbert Bayard Swope",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
    "Success isn't just about what you accomplish in your life; it's about what you inspire others to do. - Unknown",
    "Fall seven times and stand up eight. - Japanese Proverb",
    "Some people dream of success while others wake up and work. - Unknown",
    "If you can dream it, you can do it. - Walt Disney",
    "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
    "Success is not in what you have, but who you are. - Bo Bennett",
    "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
    "Success is not just about making money. It's about making a difference. - Unknown",
    "Don't wait. The time will never be just right. - Napoleon Hill",
    "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
    "There are no secrets to success. It is the result of preparation, hard work, and learning from failure. - Colin Powell",
    "Success seems to be connected with action. Successful people keep moving. They make mistakes, but they don't quit. - Conrad Hilton",
    "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will. - Vince Lombardi",
    "The secret of success is to do the common thing uncommonly well. - John D. Rockefeller Jr.",
    "I cannot give you the formula for success, but I can give you the formula for failure--It is: Try to please everybody. - Herbert Bayard Swope",
    "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
    "Success isn't just about what you accomplish in your life; it's about what you inspire others to do. - Unknown",
    "Fall seven times and stand up eight. - Japanese Proverb",
    "Some people dream of success while others wake up and work. - Unknown",
    "If you can dream it, you can do it. - Walt Disney",
    "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
    "Success is not in what you have, but who you are. - Bo Bennett",
    "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
    "Success is not just about making money. It's about making a difference. - Unknown",
    "Don't wait. The time will never be just right. - Napoleon Hill",
    "They always said it’s impossible and then one came who didn’t know that and just did - Multiple",
    "Get paid for the subject you love! - Cloud Atlas",
    "Decentralization places the globe within your grasp, ensuring your voice resonates daily, not merely at the ballot box every few years. It’s about making your voice count every day, not just delegating it during elections. - Cloud Atlas",
];
  let fadeDuration = 5; // Duration in seconds

  function moveLight() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    const edge = Math.floor(Math.random() * 4);
    let startX, startY, endX, endY;

    switch (edge) {
      case 0: // top
        startX = Math.random() * vw;
        startY = 0;
        endX = Math.random() * vw;
        endY = vh;
        break;
      case 1: // right
        startX = vw;
        startY = Math.random() * vh;
        endX = 0;
        endY = Math.random() * vh;
        break;
      case 2: // bottom
        startX = Math.random() * vw;
        startY = vh;
        endX = Math.random() * vw;
        endY = 0;
        break;
      case 3: // left
        startX = 0;
        startY = Math.random() * vh;
        endX = vw;
        endY = Math.random() * vh;
        break;
    }

    if (light) {
      light.style.left = `${startX}px`;
      light.style.top = `${startY}px`;
    }

    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    light.style.transition = `all ${distance / 100}s linear`;

    setTimeout(() => {
      if (light) {
        light.style.left = `${endX}px`;
        light.style.top = `${endY}px`;
      }
    }, 100);
  }

  function showMessage() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    const messageWidth = 380; // Adjust this value based on your message width
    const messageHeight = 50; // Adjust this value based on your message height

    const x = Math.random() * (vw - messageWidth);
    const y = Math.random() * (vh - messageHeight);

    if (messageElement) {
      messageElement.style.left = `${x}px`;
      messageElement.style.top = `${y}px`;

      // Choose a random message index
      const randomIndex = Math.floor(Math.random() * messages.length);
      messageElement.textContent = messages[randomIndex];

      messageElement.style.transition = `opacity ${fadeDuration}s ease-in-out`;
      messageElement.style.opacity = '1';

      setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(showMessage, 10000); // wait for a short time before showing the next message
      }, 15000); // show each message for 10 seconds
    }
  }

  onMount(() => {
    setInterval(moveLight, 6000);
    showMessage();
  });
</script>

<div class="container">
  <div id="hex-grid">
    <div bind:this={light} class="light"></div>
    <div bind:this={messageElement} class="message"></div>
    <div class="grid"></div>
  </div>
</div>

<style>
  .container {
    background: #2b2b2b;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    position: relative;
    z-index: 0;
  }

  #hex-grid {
    height: 100vh;
    background: #000;
    z-index: 1;
  }

  #hex-grid .grid {
    position: absolute;
    top: 0;
    left: 0;
    background: url(/public/grid.svg) repeat;
    width: 100%;
    height: 100%;
    z-index: 3;
    background-size: 500px;
  }

  #hex-grid .light {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 15em;
    height: 15em;
    filter: blur(15px);
    background: linear-gradient(90deg, #335bf4 0%, #2ae9c9 100%);
    z-index: 2;
  }

  #hex-grid .message {
    position: absolute;
    width: 380px; /* Adjust based on message length */
    height: 50px; /* Adjust based on message height */
    font-size: 1.5em;
    color: #fff;
    text-align: center;
    line-height: 50px;
    opacity: 0;
    transition: opacity 5s ease-in-out; /* Adjust the duration here */
    z-index: 4;
  }
</style>
