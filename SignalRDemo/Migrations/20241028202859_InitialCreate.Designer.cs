﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SignalRDemo.Data;

#nullable disable

namespace SignalRDemo.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20241028202859_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.20")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("SignalRDemo.Models.Connection", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<string>("SignalrId")
                        .IsRequired()
                        .HasMaxLength(22)
                        .HasColumnType("varchar(22)")
                        .HasColumnName("signalrId");

                    b.Property<DateTime?>("TimeStamp")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime")
                        .HasColumnName("timeStamp")
                        .HasDefaultValueSql("CURRENT_TIMESTAMP");

                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)")
                        .HasColumnName("userId");

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "UserId" }, "userId");

                    b.ToTable("connections", (string)null);
                });

            modelBuilder.Entity("SignalRDemo.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)")
                        .HasColumnName("id");

                    b.Property<int>("BeerGameAmount")
                        .HasColumnType("mediumint")
                        .HasColumnName("beerGameAmount");

                    b.Property<short>("BeerWinAmount")
                        .HasColumnType("smallint")
                        .HasColumnName("beerWinAmount");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("email");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)")
                        .HasColumnName("name");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasMaxLength(60)
                        .HasColumnType("varchar(60)")
                        .HasColumnName("passwordHash");

                    b.Property<sbyte>("Role")
                        .HasColumnType("tinyint")
                        .HasColumnName("role");

                    b.Property<int>("RspDraws")
                        .HasColumnType("mediumint")
                        .HasColumnName("rspDraws");

                    b.Property<int>("RspGames")
                        .HasColumnType("int")
                        .HasColumnName("rspGames");

                    b.Property<int>("RspWins")
                        .HasColumnType("mediumint")
                        .HasColumnName("rspWins");

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "Email" }, "email")
                        .IsUnique();

                    b.ToTable("users", (string)null);
                });

            modelBuilder.Entity("SignalRDemo.Models.Connection", b =>
                {
                    b.HasOne("SignalRDemo.Models.User", "User")
                        .WithMany("Connections")
                        .HasForeignKey("UserId")
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("SignalRDemo.Models.User", b =>
                {
                    b.Navigation("Connections");
                });
#pragma warning restore 612, 618
        }
    }
}
