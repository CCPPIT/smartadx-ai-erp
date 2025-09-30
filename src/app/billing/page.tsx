"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  CreditCard, 
  Receipt, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc-react";

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Mock invoices
  const invoices = [
    {
      id: "INV-2025-001",
      client: "شركة التقنية الحديثة",
      amount: 2500.00,
      status: "paid",
      date: "2025-09-15",
      dueDate: "2025-09-30",
      items: 3
    },
    {
      id: "INV-2025-002",
      client: "الحلول الرقمية المتكاملة",
      amount: 1800.00,
      status: "pending",
      date: "2025-09-20",
      dueDate: "2025-10-05",
      items: 2
    },
    {
      id: "INV-2025-003",
      client: "الإبداع الرقمي",
      amount: 3200.00,
      status: "overdue",
      date: "2025-08-25",
      dueDate: "2025-09-10",
      items: 4
    },
    {
      id: "INV-2025-004",
      client: "شركة المستقبل",
      amount: 1500.00,
      status: "paid",
      date: "2025-09-01",
      dueDate: "2025-09-15",
      items: 2
    },
    {
      id: "INV-2025-005",
      client: "الرؤية الرقمية",
      amount: 2800.00,
      status: "pending",
      date: "2025-09-25",
      dueDate: "2025-10-10",
      items: 3
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">مدفوع</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">معلق</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500 hover:bg-red-600">متأخر</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">غير معروف</Badge>;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = invoices
    .filter(inv => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              الفواتير والمدفوعات
            </h1>
            <p className="text-muted-foreground mt-1">
              إدارة الفواتير والمدفوعات الخاصة بك
            </p>
          </div>
          <Button className="gradient-primary text-white border-0 hover:scale-105 transition-transform flex items-center gap-2">
            <Plus className="w-4 h-4" />
            فاتورة جديدة
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الإيرادات الإجمالية</p>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المدفوعات</p>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">معلق</p>
                  <p className="text-2xl font-bold">${pendingAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-600">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">متأخر</p>
                  <p className="text-2xl font-bold">${overdueAmount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="glass-morphism border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="بحث في الفواتير..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-foreground placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="حالة الفاتورة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="paid">مدفوع</SelectItem>
                    <SelectItem value="pending">معلق</SelectItem>
                    <SelectItem value="overdue">متأخر</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  تطبيق
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>الفواتير الحديثة</CardTitle>
            <CardDescription>إدارة فواتير العملاء والمدفوعات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-right py-3 px-4">رقم الفاتورة</th>
                    <th className="text-right py-3 px-4">العميل</th>
                    <th className="text-right py-3 px-4">المبلغ</th>
                    <th className="text-right py-3 px-4">التاريخ</th>
                    <th className="text-right py-3 px-4">تاريخ الاستحقاق</th>
                    <th className="text-right py-3 px-4">الحالة</th>
                    <th className="text-right py-3 px-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <motion.tr
                      key={invoice.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-white/10 hover:bg-white/5"
                    >
                      <td className="py-4 px-4 font-medium">{invoice.id}</td>
                      <td className="py-4 px-4">{invoice.client}</td>
                      <td className="py-4 px-4">${invoice.amount.toLocaleString()}</td>
                      <td className="py-4 px-4">{invoice.date}</td>
                      <td className="py-4 px-4">{invoice.dueDate}</td>
                      <td className="py-4 px-4">{getStatusBadge(invoice.status)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              طرق الدفع
            </CardTitle>
            <CardDescription>إدارة طرق الدفع المتوفرة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "بطاقة ائتمان",
                  description: "Visa, MasterCard, American Express",
                  icon: CreditCard,
                  active: true
                },
                {
                  title: "باي بال",
                  description: "الدفع عبر PayPal",
                  icon: Receipt,
                  active: true
                },
                {
                  title: "تحويل بنكي",
                  description: "الدفع المباشر عبر التحويل البنكي",
                  icon: TrendingUp,
                  active: false
                }
              ].map((method, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    method.active 
                      ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30" 
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl ${
                      method.active 
                        ? "bg-gradient-to-br from-purple-500 to-pink-600" 
                        : "bg-gray-500"
                    }`}>
                      <method.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold">{method.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                  <Button 
                    variant={method.active ? "outline" : "default"}
                    size="sm"
                    className={method.active ? "" : "gradient-primary text-white border-0"}
                  >
                    {method.active ? "إدارة" : "تفعيل"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}