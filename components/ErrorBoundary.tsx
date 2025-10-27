import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  // FIX: Switched to a class property for state initialization.
  // The constructor-based approach was causing type errors because `this.state`
  // on React.Component is readonly. This change resolves errors for both
  // `this.state` and `this.props` and is the modern, correct way to initialize state.
  state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    // Cập nhật state để lần render tiếp theo sẽ hiển thị giao diện dự phòng.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Bạn cũng có thể ghi lại lỗi vào một dịch vụ báo cáo lỗi
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Giao diện dự phòng tùy chỉnh
      return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Rất tiếc, đã có lỗi xảy ra.</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Ứng dụng đã gặp phải một lỗi không mong muốn. Vui lòng thử tải lại trang.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-hanguk-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-hanguk-blue-700"
          >
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
