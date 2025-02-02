document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clear');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth - 40;
        canvas.height = window.innerHeight - 100;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Drawing variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Clear canvas
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', () => {
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });

    // Add image preview before upload
    document.querySelector('input[type="file"]').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Create preview element if it doesn't exist
                let preview = document.querySelector('.upload-preview');
                if (!preview) {
                    preview = document.createElement('div');
                    preview.className = 'upload-preview';
                    preview.style.cssText = `
                        margin-top: 1rem;
                        max-width: 300px;
                        border-radius: 5px;
                        overflow: hidden;
                    `;
                    document.querySelector('.upload-section').appendChild(preview);
                }
                
                // Update preview image
                preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: auto;">`;
            }
            reader.readAsDataURL(file);
        }
    });

    // Fade out alerts after 3 seconds
    document.querySelectorAll('.alert').forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.5s';
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    });

    // Add loading state to upload button
    document.querySelector('form').addEventListener('submit', function(e) {
        const button = this.querySelector('button');
        button.disabled = true;
        button.innerHTML = 'Uploading...';
    });

    // Add hover effect to photo cards
    document.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s';
        });
        
        card.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
