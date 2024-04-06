document.addEventListener('DOMContentLoaded', function() {
    var submitButton = document.getElementById('submit');
    if (submitButton) {
        submitButton.addEventListener('click', function(event){
            event.preventDefault(); // 阻止表单默认提交行为

            var title = document.getElementById('title').value;
            var body = document.getElementById('body').value;
            var jmjx = document.getElementById('jmjx').value;

            fetch('/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, body, jmjx }),
            })
            .then(response => response.json())
            .then(data => {
                alert('文件创建成功: ' + data.filename);
            })
            .catch((error) => {
                alert('失败了: ' + error);
            });
        });
    } else {
        console.error('Submit button not found');
    }
});