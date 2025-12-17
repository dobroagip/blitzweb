<?php
/**
 * Email Handler для Blitz Web Studio
 * 
 * Этот файл обрабатывает отправку email с контактной формы
 * Загрузите на ваш сервер в папку /api/
 */

// Настройки безопасности
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); // В production укажите конкретный домен
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Только POST запросы
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// ============================================
// НАСТРОЙКИ - ИЗМЕНИТЕ ПОД ВАШИ ДАННЫЕ
// ============================================

$CONFIG = [
    // Email получателя (ваш email)
    'to_email' => 'your-email@example.com',
    
    // Email отправителя (должен быть с вашего домена)
    'from_email' => 'noreply@yourdomain.com',
    'from_name' => 'Blitz Web Studio Contact Form',
    
    // Настройки для career applications
    'career_email' => 'hr@yourdomain.com', // Отдельный email для вакансий
    
    // Максимальный размер файла (5MB)
    'max_file_size' => 5 * 1024 * 1024,
    
    // Разрешенные типы файлов для резюме
    'allowed_file_types' => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    
    // Папка для загрузки файлов (должна существовать и иметь права на запись)
    'upload_dir' => __DIR__ . '/uploads/',
];

// ============================================
// Валидация и получение данных
// ============================================

function validate_input($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Получаем данные из POST
$name = validate_input($_POST['name'] ?? '');
$email = validate_input($_POST['email'] ?? '');
$service = validate_input($_POST['service'] ?? '');
$message = validate_input($_POST['message'] ?? '');
$resume_link = validate_input($_POST['resumeLink'] ?? '');
$is_career = isset($_POST['isCareerApplication']) && $_POST['isCareerApplication'] === '1';

// Проверка обязательных полей
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Будь ласка, заповніть всі обов\'язкові поля'
    ]);
    exit;
}

// Проверка email
if (!validate_email($email)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Невірний формат email'
    ]);
    exit;
}

// ============================================
// Обработка файла резюме
// ============================================

$resume_filename = null;
$resume_path = null;

if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['resume'];
    
    // Проверка размера
    if ($file['size'] > $CONFIG['max_file_size']) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Файл занадто великий. Максимум 5MB'
        ]);
        exit;
    }
    
    // Проверка типа файла
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    // finfo_close автоматично закривається при завершенні скрипта (PHP 8.1+)
    
    if (!in_array($mime_type, $CONFIG['allowed_file_types'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Дозволені лише PDF, DOC, DOCX файли'
        ]);
        exit;
    }
    
    // Создаем папку если не существует
    if (!is_dir($CONFIG['upload_dir'])) {
        mkdir($CONFIG['upload_dir'], 0755, true);
    }
    
    // Генерируем безопасное имя файла
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $resume_filename = uniqid('resume_') . '_' . time() . '.' . $extension;
    $resume_path = $CONFIG['upload_dir'] . $resume_filename;
    
    // Перемещаем файл
    if (!move_uploaded_file($file['tmp_name'], $resume_path)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Помилка завантаження файлу'
        ]);
        exit;
    }
}

// ============================================
// Формирование и отправка email
// ============================================

// Выбираем email получателя
$to = $is_career ? $CONFIG['career_email'] : $CONFIG['to_email'];

// Тема письма
$subject = $is_career 
    ? "💼 Нова заявка на вакансію від $name"
    : "📧 Нове повідомлення з форми контактів від $name";

// HTML тело письма
$html_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22d3ee 0%, #0891b2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #475569; font-size: 14px; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #22d3ee; }
        .footer { background: #1e293b; color: #94a3b8; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1 style='margin:0;'>" . ($is_career ? '💼 Заявка на вакансію' : '📧 Нове повідомлення') . "</h1>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Ім'я:</div>
                <div class='value'>$name</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'><a href='mailto:$email'>$email</a></div>
            </div>
            <div class='field'>
                <div class='label'>" . ($is_career ? 'Позиція/Інтерес:' : 'Послуга:') . "</div>
                <div class='value'>$service</div>
            </div>
            <div class='field'>
                <div class='label'>" . ($is_career ? 'Деталі заявки:' : 'Повідомлення:') . "</div>
                <div class='value' style='white-space: pre-wrap;'>$message</div>
            </div>";

if (!empty($resume_link)) {
    $html_body .= "
            <div class='field'>
                <div class='label'>📎 Посилання на резюме:</div>
                <div class='value'><a href='$resume_link' target='_blank'>$resume_link</a></div>
            </div>";
}

if ($resume_filename) {
    $html_body .= "
            <div class='field'>
                <div class='label'>📄 Файл резюме:</div>
                <div class='value'>Прикріплено: $resume_filename</div>
            </div>";
}

$html_body .= "
        </div>
        <div class='footer'>
            <p>Blitz Web Studio • " . date('d.m.Y H:i') . "</p>
        </div>
    </div>
</body>
</html>
";

// Plain text версия
$text_body = $is_career ? "Заявка на вакансію\n\n" : "Нове повідомлення\n\n";
$text_body .= "Ім'я: $name\n";
$text_body .= "Email: $email\n";
$text_body .= ($is_career ? "Позиція: " : "Послуга: ") . "$service\n\n";
$text_body .= "Повідомлення:\n$message\n";
if (!empty($resume_link)) {
    $text_body .= "\nПосилання на резюме: $resume_link\n";
}

// Headers для email
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    "From: {$CONFIG['from_name']} <{$CONFIG['from_email']}>",
    "Reply-To: $name <$email>",
    'X-Mailer: PHP/' . phpversion()
];

// Если есть файл резюме, создаем multipart email
if ($resume_path && file_exists($resume_path)) {
    $boundary = md5(time());
    
    $headers = [
        'MIME-Version: 1.0',
        "Content-Type: multipart/mixed; boundary=\"$boundary\"",
        "From: {$CONFIG['from_name']} <{$CONFIG['from_email']}>",
        "Reply-To: $name <$email>",
        'X-Mailer: PHP/' . phpversion()
    ];
    
    $email_body = "--$boundary\r\n";
    $email_body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $email_body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $email_body .= $html_body . "\r\n";
    
    $file_content = chunk_split(base64_encode(file_get_contents($resume_path)));
    $email_body .= "--$boundary\r\n";
    $email_body .= "Content-Type: application/octet-stream; name=\"$resume_filename\"\r\n";
    $email_body .= "Content-Transfer-Encoding: base64\r\n";
    $email_body .= "Content-Disposition: attachment; filename=\"$resume_filename\"\r\n\r\n";
    $email_body .= $file_content . "\r\n";
    $email_body .= "--$boundary--";
} else {
    $email_body = $html_body;
}

// Отправка email
$success = mail($to, $subject, $email_body, implode("\r\n", $headers));

// Ответ клиенту
if ($success) {
    // Логируем успешную отправку (опционально)
    $log_entry = date('[Y-m-d H:i:s]') . " Email sent from: $email ($name)\n";
    file_put_contents(__DIR__ . '/email_log.txt', $log_entry, FILE_APPEND);
    
    echo json_encode([
        'success' => true,
        'message' => $is_career 
            ? 'Вашу заявку успішно відправлено! Ми зв\'яжемося з вами найближчим часом.'
            : 'Дякуємо за повідомлення! Ми зв\'яжемося з вами найближчим часом.'
    ]);
} else {
    http_response_code(500);
    
    // Логируем ошибку
    $error_entry = date('[Y-m-d H:i:s]') . " Email FAILED from: $email ($name)\n";
    file_put_contents(__DIR__ . '/email_errors.txt', $error_entry, FILE_APPEND);
    
    echo json_encode([
        'success' => false,
        'message' => 'Помилка відправки. Спробуйте пізніше або напишіть нам напряму.',
        'error' => 'Mail function failed'
    ]);
}
?>
