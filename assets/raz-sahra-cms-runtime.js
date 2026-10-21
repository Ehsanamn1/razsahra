(function () {
  "use strict";

  function setStatus(form, message, kind) {
    const status = form.querySelector(".form-status");
    if (!status) return;
    status.className = "form-status" + (kind ? " " + kind : "");
    status.textContent = message || "";
  }

  function fieldValue(form, id) {
    const field = form.querySelector("#" + id);
    return field ? String(field.value || "").trim() : "";
  }

  function isEnglish() {
    return window.RSCurrentLanguage === "en";
  }

  function makePayload(form) {
    const partnership = form.getAttribute("data-local-form") === "partnership";
    const subject = fieldValue(form, partnership ? "partner-role" : "contact-topic");
    const details = fieldValue(form, partnership ? "partner-details" : "contact-message");
    const consent = form.querySelector('input[type="checkbox"][required]');
    const values = {};
    Array.from(form.querySelectorAll("input[name], select[name], textarea[name]")).forEach(function (field) {
      if (field.type === "checkbox") values[field.name] = Boolean(field.checked);
      else values[field.name] = String(field.value || "").trim();
    });
    return {
      kind: partnership ? "partnership" : "contact",
      name: fieldValue(form, partnership ? "partner-name" : "contact-name"),
      phone: fieldValue(form, partnership ? "partner-phone" : "contact-phone"),
      email: "",
      company: "",
      message: (partnership ? "نوع همکاری: " : "موضوع پیام: ") + subject + "\n\n" + details,
      payload: {
        subject: subject,
        details: details,
        consent: Boolean(consent && consent.checked),
        source: "raz-sahra-website",
        fields: values
      }
    };
  }

  function validate(form) {
    const required = Array.from(form.querySelectorAll("[required]"));
    let firstInvalid = null;
    required.forEach(function (field) {
      field.removeAttribute("aria-invalid");
      const empty = field.type === "checkbox" ? !field.checked : !String(field.value || "").trim();
      const badEmail = field.type === "email" && field.value.trim() && !field.checkValidity();
      if (empty || badEmail) {
        field.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = field;
      }
    });
    if (firstInvalid) {
      firstInvalid.focus();
      setStatus(form, isEnglish()
        ? "Complete the required fields and confirm the data-submission notice."
        : "فیلدهای ضروری را کامل کنید و رضایت مربوط به ثبت اطلاعات را تأیید کنید.", "error");
      return false;
    }
    return true;
  }

  function downloadFallback(form, data) {
    const en = isEnglish();
    const lines = [
      en ? "RAZ SAHRA | Inquiry backup" : "راز صحرا | نسخه پشتیبان درخواست",
      (en ? "Prepared at: " : "زمان آماده‌سازی: ") + new Date().toLocaleString(en ? "en-US" : "fa-IR"),
      "",
      en ? "The website could not confirm online storage. This file was generated locally and has not been sent." : "ثبت آنلاین از سوی سرور تأیید نشد. این فایل فقط به‌صورت محلی ساخته شده و از طریق سایت ارسال نشده است.",
      "",
      (en ? "Type: " : "نوع درخواست: ") + data.kind,
      (en ? "Name: " : "نام: ") + data.name,
      (en ? "Phone: " : "شماره تماس: ") + data.phone,
      (en ? "Subject: " : "موضوع: ") + data.payload.subject,
      "",
      data.message,
      "",
      en ? "Structured details:" : "جزئیات ساختاریافته:",
      JSON.stringify(data.payload, null, 2)
    ];
    const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = data.kind === "partnership" ? "raz-sahra-partnership-backup.txt" : "raz-sahra-contact-backup.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 1000);
    setStatus(form, en
      ? "Online storage is unavailable. A local backup file was created; the request was not sent."
      : "ثبت آنلاین در دسترس نیست؛ فایل متنی پشتیبان آماده شد. درخواست از طریق سایت ارسال نشده است.", "error");
  }

  async function submitInquiry(form, button) {
    if (!validate(form)) return;
    const data = makePayload(form);
    if (button) button.disabled = true;
    setStatus(form, isEnglish() ? "Submitting securely…" : "در حال ثبت امن درخواست…", "");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
      });
      let result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok || !result.ok) {
        const error = new Error(result && result.error && result.error.message ? result.error.message : "server_unavailable");
        error.status = response.status;
        throw error;
      }
      form.reset();
      const id = result.inquiry && result.inquiry.id ? String(result.inquiry.id) : "";
      const reference = id ? (isEnglish() ? " Reference: " : " شناسه پیگیری: ") + id : "";
      setStatus(form, (isEnglish()
        ? "Your request was stored successfully. The company has not promised a response time."
        : "درخواست با موفقیت در سامانه ثبت شد. زمان مشخصی برای پاسخ‌گویی تضمین نشده است.") + reference, "success");
    } catch (error) {
      if (!error.status || error.status === 404 || error.status >= 500) {
        downloadFallback(form, data);
      } else {
        setStatus(form, error.message || (isEnglish() ? "Request failed." : "ثبت درخواست انجام نشد."), "error");
      }
    } finally {
      if (button) button.disabled = false;
    }
  }

  document.addEventListener("submit", function (event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches("form[data-local-form]")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const button = form.querySelector('button[type="submit"]');
    submitInquiry(form, button);
  }, true);
})();
